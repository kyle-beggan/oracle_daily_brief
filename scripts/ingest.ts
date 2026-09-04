import Parser from 'rss-parser';
import { supabase } from './supabase';

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
  const { data, error } = await supabase.from('oracle_sources').select('*').eq('is_active', true);
  if (error) {
    console.error('Error loading sources from Supabase:', error);
    return [];
  }
  return data as Source[];
}

async function loadExistingArticleUrls(): Promise<Set<string>> {
  const { data, error } = await supabase.from('oracle_articles').select('url');
  if (error) {
    console.error('Error loading articles from Supabase:', error);
    return new Set();
  }
  return new Set(data.map((a: { url: string }) => a.url));
}

async function saveArticles(articles: Article[]): Promise<void> {
  const { error } = await supabase.from('oracle_articles').insert(articles);
  if (error) {
    console.error('Error saving articles to Supabase:', error);
  }
}

// Fetch RSS Feeds
async function fetchRss(source: Source): Promise<Partial<Article>[]> {
  console.log(`Fetching RSS for ${source.name} from ${source.url}`);
  try {
    const feed = await parser.parseURL(source.url);
    return feed.items.map(item => ({
      source_id: source.id,
      url: item.link || '',
      title: item.title || 'Untitled',
      content: item.contentSnippet || item.content || '',
      published_at: item.isoDate || new Date().toISOString(),
    }));
  } catch (error) {
    console.error(`Failed to fetch RSS for ${source.name}:`, error);
    return [];
  }
}

// Fetch SAM.gov API
async function fetchSamGovApi(source: Source): Promise<Partial<Article>[]> {
  console.log(`Fetching API for ${source.name} from ${source.url}`);
  const apiKey = process.env.SAM_API_KEY;
  
  if (!apiKey) {
    console.warn("No SAM_API_KEY found, skipping SAM.gov API fetch.");
    return [];
  }

  // Calculate dynamic dates (last 7 days)
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);
  
  const formatDate = (date: Date) => {
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const postedFrom = formatDate(lastWeek);
  const postedTo = formatDate(today);

  // Construct URL
  const searchUrl = new URL(source.url);
  searchUrl.searchParams.append('api_key', apiKey);
  searchUrl.searchParams.append('ptype', 'r'); // RFI
  searchUrl.searchParams.append('organizationName', 'Department of Homeland Security');
  searchUrl.searchParams.append('postedFrom', postedFrom);
  searchUrl.searchParams.append('postedTo', postedTo);
  searchUrl.searchParams.append('limit', '1000');

  try {
    const response = await fetch(searchUrl.toString());
    if (!response.ok) {
      console.error(`SAM API returned ${response.status}: ${await response.text()}`);
      return [];
    }
    const data = await response.json();
    
    if (!data.opportunitiesData) {
      console.log('No opportunities found from SAM.gov');
      return [];
    }

    return data.opportunitiesData.map((opp: Record<string, unknown>) => ({
      source_id: source.id,
      url: (opp.uiLink as string) || `https://sam.gov/opp/${opp.noticeId}/view`,
      title: (opp.title as string) || 'Untitled Opportunity',
      content: (opp.description as string) || (opp.type as string) || 'No description available',
      published_at: (opp.publishDate as string) || new Date().toISOString(),
    }));
  } catch (error) {
    console.error(`Failed to fetch SAM.gov API:`, error);
    return [];
  }
}

async function runIngestion() {
  console.log('Starting ingestion pipeline...');
  const sources = await loadSources();
  const existingUrls = await loadExistingArticleUrls();
  
  const newArticles: Article[] = [];
  const now = new Date().toISOString();

  for (const source of sources) {
    let fetchedItems: Partial<Article>[] = [];
    if (source.type === 'rss') {
      fetchedItems = await fetchRss(source);
    } else if (source.type === 'api') {
      fetchedItems = await fetchSamGovApi(source);
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
