import fs from 'fs/promises';
import path from 'path';
import Parser from 'rss-parser';
import { supabase } from './supabase';
import { cleanApfsText, isTechRelatedApfsRecord, parseApfsDate, RawApfsRecord } from '../src/lib/apfs';
import { fetchUpdatedPrimeContractsMap } from '../src/lib/primeContracts';

// Types
interface Source {
  id: string;
  name: string;
  url: string;
  tier: number;
  type: 'rss' | 'api' | 'html';
  is_active: boolean;
}

interface Article {
  id: string;
  source_id: string;
  url: string;
  title: string;
  content: string;
  published_at: string;
  ingested_at: string;
}

const parser = new Parser({
  timeout: 10000, // 10 seconds timeout
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/rdf+xml;q=0.8, application/atom+xml;q=0.6, application/xml;q=0.4, text/xml;q=0.4'
  }
});

async function loadSources(): Promise<Source[]> {
  // Ensure MeriTalk RSS feed is registered in oracle_sources
  await supabase.from('oracle_sources').upsert(
    {
      id: 'source-meritalk',
      name: 'MeriTalk',
      url: 'https://www.meritalk.com/feed/',
      tier: 2,
      type: 'rss',
      is_active: true
    },
    { onConflict: 'id' }
  );

  const { data, error } = await supabase.from('oracle_sources').select('*').eq('is_active', true);
  if (error) {
    console.error('Error loading sources from Supabase:', error);
    return [];
  }
  return data as Source[];
}

async function loadExistingArticleUrls(): Promise<Set<string>> {
  const urls = new Set<string>();
  let from = 0;
  const step = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('oracle_articles')
      .select('url')
      .range(from, from + step - 1);
    if (error) {
      console.error('Error loading articles from Supabase:', error);
      break;
    }
    if (!data || data.length === 0) break;
    for (const a of data) {
      if (a.url) urls.add(a.url);
    }
    if (data.length < step) break;
    from += step;
  }
  return urls;
}

async function saveArticles(articles: Article[]): Promise<void> {
  const batchSize = 100;
  for (let i = 0; i < articles.length; i += batchSize) {
    const batch = articles.slice(i, i + batchSize);
    const { error } = await supabase.from('oracle_articles').insert(batch);
    if (error) {
      console.error(`Error saving article batch ${i}-${i + batch.length} to Supabase:`, error);
    }
  }
}

// Fetch RSS Feeds (with automatic fallback to common RSS paths if user entered a base domain URL via the UI)
async function fetchRss(source: Source): Promise<Partial<Article>[]> {
  console.log(`Fetching RSS for ${source.name} from ${source.url}`);
  const candidateUrls = [source.url];
  try {
    const parsed = new URL(source.url);
    if (parsed.pathname === '/' || parsed.pathname === '') {
      const origin = parsed.origin;
      candidateUrls.push(`${origin}/feed/`, `${origin}/rss`, `${origin}/rss.xml`, `${origin}/feed.xml`);
    }
  } catch {
    // ignore URL parse error
  }

  for (const urlToTry of candidateUrls) {
    try {
      const feed = await parser.parseURL(urlToTry);
      return feed.items.map(item => ({
        source_id: source.id,
        url: item.link || '',
        title: item.title || 'Untitled',
        content: item.contentSnippet || item.content || '',
        published_at: item.isoDate || new Date().toISOString(),
      }));
    } catch (error) {
      if (urlToTry === candidateUrls[candidateUrls.length - 1]) {
        console.error(`Failed to fetch RSS for ${source.name}:`, error);
      }
    }
  }
  return [];
}

// Fetch SAM.gov API (Uses SAM.gov public SGS search endpoint for DHS so it works without a 90-day expiring API key and includes full description text + sub-agency hierarchy)
async function fetchSamGovApi(source: Source): Promise<Partial<Article>[]> {
  console.log(`Fetching SAM.gov DHS opportunities for ${source.name}...`);

  // Query SAM.gov public SGS search endpoints for active DHS Sources Sought/RFIs and component opportunities (including acronyms like FEMA, CISA, CBP, USCIS, ICE, TSA, USCG, DHS)
  const sgsUrls = [
    'https://sam.gov/api/prod/sgs/v1/search/?index=opp&page=0&mode=search&size=100&is_active=true&sort=-modifiedDate&q=FEMA',
    'https://sam.gov/api/prod/sgs/v1/search/?index=opp&page=0&mode=search&size=100&is_active=true&sort=-modifiedDate&q=DHS+OR+CISA+OR+CBP+OR+USCIS',
    'https://sam.gov/api/prod/sgs/v1/search/?index=opp&page=0&mode=search&size=100&is_active=true&sort=-modifiedDate&q=ICE+OR+TSA+OR+USCG+OR+%22Secret+Service%22',
    'https://sam.gov/api/prod/sgs/v1/search/?index=opp&page=0&mode=search&size=100&is_active=true&sort=-modifiedDate&q=%22HOMELAND+SECURITY%22'
  ];

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 14);

  const allowedNoticeCodes = new Set(['r', 's', 'p', 'o', 'k']); // Sources Sought (RFI), Special Notice, Presolicitation, Solicitation, Combined

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results: any[] = [];
    const seenNoticeIds = new Set<string>();

    for (const sgsUrl of sgsUrls) {
      const response = await fetch(sgsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/hal+json, application/json, */*'
        }
      });

      if (!response.ok) {
        console.error(`SAM.gov SGS API returned ${response.status}: ${await response.text()}`);
        continue;
      }

      const data = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pageResults: any[] = data?._embedded?.results || [];
      for (const opp of pageResults) {
        const nid = opp._id || opp.noticeId;
        if (nid && !seenNoticeIds.has(nid)) {
          seenNoticeIds.add(nid);
          results.push(opp);
        }
      }
    }

    if (results.length === 0) {
      console.log('No opportunities found from SAM.gov SGS endpoint');
      return [];
    }

    const items: Partial<Article>[] = [];

    for (const opp of results) {
      if (opp.isCanceled || opp.isActive === false) continue;

      const hierarchy: Array<{ level?: number; name?: string }> = Array.isArray(opp.organizationHierarchy)
        ? opp.organizationHierarchy
        : [];
      const isDhs = hierarchy.some((h) =>
        String(h.name || '').toUpperCase().includes('HOMELAND SECURITY')
      );
      if (!isDhs) continue;

      const typeCode = String(opp.type?.code || '').toLowerCase();
      const typeLabel = String(opp.type?.value || 'Opportunity');
      if (typeCode && !allowedNoticeCodes.has(typeCode)) continue;

      const pubDateStr = opp.modifiedDate || opp.publishDate;
      const pubDate = pubDateStr ? new Date(pubDateStr) : new Date();
      if (!isNaN(pubDate.getTime()) && pubDate < cutoff) continue;

      const subAgency =
        hierarchy.find((h) => h.level === 2)?.name ||
        hierarchy[hierarchy.length - 1]?.name ||
        'Department of Homeland Security';
      const orgPath = hierarchy.map((h) => h.name).filter(Boolean).join(' > ');

      const rawDescHtml =
        Array.isArray(opp.descriptions) && opp.descriptions.length > 0
          ? String(opp.descriptions[0].content || '')
          : '';
      const cleanDesc = rawDescHtml
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&rsquo;/gi, "'")
        .replace(/&ldquo;|&rdquo;/gi, '"')
        .replace(/&amp;/gi, '&')
        .replace(/\s+/g, ' ')
        .trim();

      // Include all DHS Sources Sought (RFIs) / Special Notices, or tech-filtered solicitations
      const isRfiOrSpecialNotice = typeCode === 'r' || typeCode === 's';
      if (
        !isRfiOrSpecialNotice &&
        !isTechRelatedApfsRecord({
          id: 0,
          requirements_title: `${opp.title || ''} ${cleanDesc}`,
          requirement: cleanDesc
        })
      ) {
        continue;
      }

      const noticeId = opp._id || opp.noticeId;
      if (!noticeId) continue;

      items.push({
        source_id: source.id,
        url: `https://sam.gov/opp/${noticeId}/view`,
        title: `[${subAgency} - ${typeLabel}] ${opp.title || 'Untitled Opportunity'}`,
        content: `Organization: ${orgPath || subAgency}\nNotice Type: ${typeLabel}\nSolicitation Number: ${String(opp.solicitationNumber || 'N/A').trim()}\nResponse Deadline: ${opp.responseDate || 'TBD'}\nDescription: ${cleanDesc || 'No description available'}`,
        published_at: !isNaN(pubDate.getTime()) ? pubDate.toISOString() : new Date().toISOString()
      });
    }

    console.log(`Matched ${items.length} recent DHS SAM.gov opportunities.`);
    return items;
  } catch (error) {
    console.error('Failed to fetch SAM.gov API:', error);
    return [];
  }
}

// Fetch DHS APFS Forecast API
async function fetchApfsApi(source: Source): Promise<Partial<Article>[]> {
  console.log(`Fetching APFS Forecast API for ${source.name} from ${source.url}`);
  try {
    const response = await fetch(source.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      console.error(`APFS API returned ${response.status}: ${await response.text()}`);
      return [];
    }
    const data = (await response.json()) as RawApfsRecord[];
    if (!Array.isArray(data)) {
      console.warn('Unexpected APFS response format.');
      return [];
    }

    // Cache full forecast payload for static export and brief generation
    const publicDataDir = path.join(process.cwd(), 'public', 'data');
    await fs.mkdir(publicDataDir, { recursive: true });
    await fs.writeFile(path.join(publicDataDir, 'apfs_forecast.json'), JSON.stringify(data));
    console.log(`Saved ${data.length} APFS forecast records to public/data/apfs_forecast.json`);

    // Return records published/updated in the last 14 days for article intelligence analysis
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 14);

    return data
      .filter((item: RawApfsRecord & { publish_date?: string; last_updated_date?: string }) => {
        if (!isTechRelatedApfsRecord(item)) return false;
        const pubDate = parseApfsDate(item.last_updated_date || item.publish_date);
        return pubDate ? pubDate >= cutoff : false;
      })
      .map((item: RawApfsRecord & { publish_date?: string; last_updated_date?: string }) => {
        const pubDate = parseApfsDate(item.last_updated_date || item.publish_date) || new Date();
        const dollarRange =
          typeof item.dollar_range === 'string'
            ? item.dollar_range
            : item.dollar_range?.display_name || 'Not Specified';
        return {
          source_id: source.id,
          url: `https://apfs-cloud.dhs.gov/record/${item.id}/public-print/`,
          title: `[${item.organization || 'DHS'} APFS] ${cleanApfsText(item.requirements_title) || 'Untitled Forecast'}`,
          content: `Organization: ${item.organization || 'DHS'}\nDollar Range: ${dollarRange}\nContract Type: ${item.contract_type || 'N/A'}\nEst. Solicitation Release: ${item.estimated_solicitation_release_date || 'TBD'}\nRequirement: ${cleanApfsText(item.requirement)}`,
          published_at: pubDate.toISOString(),
        };
      });
  } catch (error) {
    console.error(`Failed to fetch APFS API for ${source.name}:`, error);
    return [];
  }
}

// Sync DHS Prime Contracts (USAspending.gov + Baseline Vehicles)
async function syncPrimeContracts(): Promise<void> {
  console.log('Syncing DHS prime contracts for all territories...');
  try {
    const updatedMap = await fetchUpdatedPrimeContractsMap();
    const publicDataDir = path.join(process.cwd(), 'public', 'data');
    await fs.mkdir(publicDataDir, { recursive: true });
    await fs.writeFile(
      path.join(publicDataDir, 'prime_contracts.json'),
      JSON.stringify(updatedMap, null, 2)
    );
    console.log('Saved updated DHS prime contracts to public/data/prime_contracts.json');
  } catch (error) {
    console.error('Failed to sync prime contracts:', error);
  }
}

async function runIngestion() {
  console.log('Starting ingestion pipeline...');
  await syncPrimeContracts();
  const sources = await loadSources();
  const existingUrls = await loadExistingArticleUrls();

  const newArticles: Article[] = [];
  const now = new Date().toISOString();

  for (const source of sources) {
    let fetchedItems: Partial<Article>[] = [];
    if (source.type === 'rss' || source.type === 'html') {
      fetchedItems = await fetchRss(source);
    } else if (source.type === 'api') {
      if (source.url.includes('apfs-cloud.dhs.gov')) {
        fetchedItems = await fetchApfsApi(source);
      } else if (source.id === 'source-sam-gov' || source.url.includes('sam.gov')) {
        fetchedItems = await fetchSamGovApi(source);
      }
    }

    for (const item of fetchedItems) {
      // Deduplication: Only process if URL is not already in our storage
      if (item.url && !existingUrls.has(item.url)) {
        const article: Article = {
          id: `art_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          source_id: item.source_id!,
          url: item.url!,
          title: item.title!,
          content: item.content || '',
          published_at: item.published_at!,
          ingested_at: now
        };
        newArticles.push(article);
        existingUrls.add(article.url); // prevent duplicates within the same run
      }
    }
  }

  if (newArticles.length > 0) {
    console.log(`Ingesting ${newArticles.length} new articles into Supabase.`);
    await saveArticles(newArticles);
  } else {
    console.log('No new articles found.');
  }
  console.log('Ingestion pipeline complete.');
}

runIngestion().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
