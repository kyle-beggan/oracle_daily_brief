import OpenAI from 'openai';
import dotenv from 'dotenv';
import { supabase } from './supabase';
import crypto from 'crypto';

dotenv.config({ path: '.env.local', override: true });

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

interface Article {
  id: string;
  source_id: string;
  url: string;
  title: string;
  content: string;
  published_at: string;
  ingested_at: string;
}

interface IntelligenceItem {
  id: string;
  article_id: string;
  territory_id: string | null;
  relevance_score: number;
  category: string[];
  summary: string;
  stakeholders: string[];
  commercial_signal: string;
  recommendations: string[];
  analyzed_at: string;
}

interface Territory {
  id: string;
  name: string;
}

const FED_SOURCES = new Set([
  'source-nextgov',
  'source-fedscoop',
  'source-federalnewsnetwork',
  'source-orangeslices',
  'source-govexec-tech',
  'source-govciomedia',
  'source-cisa-advisories',
  'source-defensescoop',
  'source-executivegov',
  'source-hsdf',
  'source-statetech'
]);

const RELEVANT_KEYWORDS = [
  'dhs', 'homeland security', 'fema', 'cisa', 'customs', 'cbp',
  'immigration', 'ice', 'secret service', 'usss', 'tsa', 'transportation security',
  'coast guard', 'uscg', 'uscis', 'hsoac', 'hssedi', 'intelligence & analysis',
  'oracle', 'cloud', 'fedramp', 'cyber', 'cybersecurity', 'artificial intelligence',
  'procurement', 'contract award', 'rfi', 'rfp'
];

async function loadRecentArticles(): Promise<Article[]> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  let from = 0;
  const step = 1000;
  const articles: Article[] = [];
  while (true) {
    const { data, error } = await supabase
      .from('oracle_articles')
      .select('*')
      .gte('published_at', thirtyDaysAgo)
      .order('published_at', { ascending: false })
      .range(from, from + step - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    articles.push(...(data as Article[]));
    if (data.length < step) break;
    from += step;
  }
  return articles;
}

async function loadAnalyzedArticleIds(): Promise<Set<string>> {
  const ids = new Set<string>();
  let from = 0;
  const step = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('oracle_intelligence')
      .select('article_id')
      .range(from, from + step - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    for (const item of data) {
      if (item.article_id) ids.add(item.article_id);
    }
    if (data.length < step) break;
    from += step;
  }
  return ids;
}

async function loadTerritories(): Promise<Territory[]> {
  const { data, error } = await supabase.from('oracle_territories').select('id, name');
  if (error) throw error;
  return data as Territory[];
}

async function saveIntelligence(items: IntelligenceItem[]): Promise<void> {
  const { error } = await supabase.from('oracle_intelligence').insert(items);
  if (error) throw error;
}

async function analyzeArticle(article: Article, territoriesList: string): Promise<Omit<IntelligenceItem, 'id' | 'article_id' | 'analyzed_at'>> {
  if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    console.warn("No NEXT_PUBLIC_OPENAI_API_KEY found, skipping actual analysis and returning dummy data.");
    return {
      territory_id: "unassigned",
      relevance_score: 50,
      category: ["Mock"],
      summary: "Mock summary due to missing API key.",
      stakeholders: [],
      commercial_signal: "Why Account Executive Should Care: N/A",
      recommendations: ["Set NEXT_PUBLIC_OPENAI_API_KEY"]
    };
  }

  const systemPrompt = `
You are an elite federal market analyst and OSINT researcher working for an Oracle Federal Cloud Account Executive.
Your job is to analyze news articles and evaluate their relevance to Oracle's cloud/AI business across the following territories:
${territoriesList}

Analyze the article and return a structured JSON response evaluating its commercial relevance.
If it is irrelevant to any territory, assign territory_id="unassigned" and relevance_score=0. Otherwise, return the exact UUID of the most relevant territory.
The relevance score is 0-100 based on Territory Relevance, Executive Importance, Commercial Signal, Oracle Alignment, and Timing.
Categories can include: Leadership, Budget, Acquisition, Contract Award, Cloud, AI, Data, Cyber, etc.
Include a commercial signal titled "Why Account Executive Should Care".
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Title: ${article.title}\nURL: ${article.url}\nContent: ${article.content.substring(0, 3000)}` }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "intelligence_analysis",
        schema: {
          type: "object",
          properties: {
            territory_id: { type: "string", description: "UUID of the territory, or 'unassigned'" },
            relevance_score: { type: "number", description: "0-100 score" },
            category: { type: "array", items: { type: "string" } },
            summary: { type: "string" },
            stakeholders: { type: "array", items: { type: "string" } },
            commercial_signal: { type: "string" },
            recommendations: { type: "array", items: { type: "string" } }
          },
          required: ["territory_id", "relevance_score", "category", "summary", "stakeholders", "commercial_signal", "recommendations"],
          additionalProperties: false
        },
        strict: true
      }
    }
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("No content from OpenAI");
  
  return JSON.parse(content);
}

async function runAnalysis() {
  console.log('Starting intelligence analysis pipeline...');
  const analyzedArticleIds = await loadAnalyzedArticleIds();
  console.log(`Loaded ${analyzedArticleIds.size} already analyzed article IDs.`);

  const allRecentArticles = await loadRecentArticles();
  console.log(`Loaded ${allRecentArticles.length} articles published in the last 30 days.`);

  const territories = await loadTerritories();
  const territoriesList = territories.map(t => `${t.id}: ${t.name}`).join('\n');

  // Deduplicate recent articles by URL and filter out already analyzed articles
  const seenUrls = new Set<string>();
  const unanalyzedArticles: Article[] = [];
  for (const a of allRecentArticles) {
    if (!analyzedArticleIds.has(a.id) && !seenUrls.has(a.url)) {
      seenUrls.add(a.url);
      unanalyzedArticles.push(a);
    }
  }

  console.log(`Found ${unanalyzedArticles.length} unique unanalyzed articles in the last 30 days.`);

  // Separate articles into:
  // 1. High-priority candidates: from federal tech sources OR matching federal/territory keywords
  // 2. Low-relevance general news (NYT, WaPo, NPR, PBS without keywords): automatically marked unassigned (score 0)
  const candidatesToAnalyze: Article[] = [];
  const autoUnassignedItems: IntelligenceItem[] = [];

  for (const article of unanalyzedArticles) {
    const text = `${article.title} ${article.content}`.toLowerCase();
    const hasKeyword = RELEVANT_KEYWORDS.some(kw => text.includes(kw));
    const isFedSource = FED_SOURCES.has(article.source_id);

    if (isFedSource || hasKeyword) {
      candidatesToAnalyze.push(article);
    } else {
      // Mark general news as unassigned in DB so we don't re-examine it
      autoUnassignedItems.push({
        id: crypto.randomUUID(),
        article_id: article.id,
        analyzed_at: new Date().toISOString(),
        territory_id: null,
        relevance_score: 0,
        category: ['General News'],
        summary: 'Non-federal general news article outside account executive focus.',
        stakeholders: [],
        commercial_signal: 'Why Account Executive Should Care: N/A',
        recommendations: []
      });
    }
  }

  // Save auto-unassigned items in batches
  if (autoUnassignedItems.length > 0) {
    console.log(`Marking ${autoUnassignedItems.length} non-federal general articles as unassigned...`);
    const batchSize = 100;
    for (let i = 0; i < autoUnassignedItems.length; i += batchSize) {
      await saveIntelligence(autoUnassignedItems.slice(i, i + batchSize));
    }
  }

  // Prioritize candidates: articles with direct keyword matches first, then fed sources
  candidatesToAnalyze.sort((a, b) => {
    const aText = `${a.title} ${a.content}`.toLowerCase();
    const bText = `${b.title} ${b.content}`.toLowerCase();
    const aMatches = RELEVANT_KEYWORDS.filter(kw => aText.includes(kw)).length;
    const bMatches = RELEVANT_KEYWORDS.filter(kw => bText.includes(kw)).length;
    if (bMatches !== aMatches) return bMatches - aMatches;
    return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
  });

  // Limit processing to top 80 candidates per pipeline run to stay fast and prevent timeouts
  const MAX_PER_RUN = 80;
  const batchToProcess = candidatesToAnalyze.slice(0, MAX_PER_RUN);
  console.log(`Selected ${batchToProcess.length} relevant candidate articles to analyze with AI.`);

  // Process with concurrency = 5
  const CONCURRENCY = 5;
  const newItems: IntelligenceItem[] = [];

  for (let i = 0; i < batchToProcess.length; i += CONCURRENCY) {
    const chunk = batchToProcess.slice(i, i + CONCURRENCY);
    const chunkPromises = chunk.map(async (article) => {
      try {
        console.log(`Analyzing: "${article.title}" (${article.published_at})`);
        const analysis = await analyzeArticle(article, territoriesList);
        return {
          id: crypto.randomUUID(),
          article_id: article.id,
          analyzed_at: new Date().toISOString(),
          ...analysis,
          territory_id: analysis.territory_id === 'unassigned' ? null : analysis.territory_id
        } as IntelligenceItem;
      } catch (err) {
        console.error(`Failed to analyze article ${article.id} (${article.title}):`, err);
        return null;
      }
    });

    const chunkResults = await Promise.all(chunkPromises);
    for (const r of chunkResults) {
      if (r) newItems.push(r);
    }

    if (newItems.length >= 10) {
      console.log(`Saving batch of ${newItems.length} intelligence items to Supabase...`);
      await saveIntelligence(newItems);
      newItems.length = 0;
    }
  }

  if (newItems.length > 0) {
    console.log(`Saving remaining ${newItems.length} intelligence items to Supabase...`);
    await saveIntelligence(newItems);
  }

  console.log('Intelligence analysis pipeline complete.');
}

runAnalysis().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
