import fs from 'fs/promises';
import path from 'path';
import Parser from 'rss-parser';

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

// Setup paths
const DATA_DIR = path.join(process.cwd(), 'data');
const SOURCES_FILE = path.join(DATA_DIR, 'sources.json');
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json');

const parser = new Parser();

async function loadSources(): Promise<Source[]> {
  const data = await fs.readFile(SOURCES_FILE, 'utf-8');
  return JSON.parse(data);
}

async function loadExistingArticles(): Promise<Article[]> {
  try {
    const data = await fs.readFile(ARTICLES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as { code?: string }).code === 'ENOENT') return [];
    throw error;
  }
}

async function saveArticles(articles: Article[]): Promise<void> {
  await fs.writeFile(ARTICLES_FILE, JSON.stringify(articles, null, 2));
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

// Fetch SAM.gov API (Mock for now since it requires an API key, we will just simulate finding an opportunity)
async function fetchSamGovApi(source: Source): Promise<Partial<Article>[]> {
  console.log(`Fetching API for ${source.name} from ${source.url}`);
  // In a real implementation, you would need an API key from SAM.gov
  // https://api.sam.gov/prod/opportunities/v2/search?api_key=YOUR_KEY&postedFrom=yesterday
  
  // For MVP demonstration, return an empty array to avoid API key errors.
  return [];
}

async function runIngestion() {
  console.log('Starting ingestion pipeline...');
  const sources = await loadSources();
  const existingArticles = await loadExistingArticles();
  
  // Create a Set of existing URLs for fast deduplication
  const existingUrls = new Set(existingArticles.map(a => a.url));
  const newArticles: Article[] = [];
  const now = new Date().toISOString();

  for (const source of sources) {
    if (!source.is_active) continue;

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
    console.log(`Ingested ${newArticles.length} new articles.`);
    const updatedArticles = [...existingArticles, ...newArticles];
    await saveArticles(updatedArticles);
  } else {
    console.log('No new articles found.');
  }
  console.log('Ingestion pipeline complete.');
}

runIngestion().catch(console.error);
