import fs from 'fs/promises';
import path from 'path';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local', override: true });

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const DATA_DIR = path.join(process.cwd(), 'data');
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json');
const INTELLIGENCE_FILE = path.join(DATA_DIR, 'intelligence.json');

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
  territory_id: string; // "unassigned" if none
  relevance_score: number;
  category: string[];
  summary: string;
  stakeholders: string[];
  commercial_signal: string;
  recommendations: string[];
  analyzed_at: string;
}

async function loadFile<T>(filePath: string): Promise<T[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as { code?: string }).code === 'ENOENT') return [];
    throw error;
  }
}

async function saveFile<T>(filePath: string, data: T[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

const SYSTEM_PROMPT = `
You are an elite federal market analyst and OSINT researcher working for an Oracle Federal Cloud Account Executive.
Your job is to analyze news articles and evaluate their relevance to Oracle's cloud/AI business across 5 DHS territories:
1. DHS Office of Intelligence & Analysis (I&A)
2. FEMA
3. HSOAC & HSSEDI
4. DHS Headquarters
5. US Secret Service (USSS)

Analyze the article and return a structured JSON response evaluating its commercial relevance.
If it is irrelevant to any territory, assign territory_id="unassigned" and relevance_score=0.
The relevance score is 0-100 based on Territory Relevance, Executive Importance, Commercial Signal, Oracle Alignment, and Timing.
Categories can include: Leadership, Budget, Acquisition, Contract Award, Cloud, AI, Data, Cyber, etc.
Include a commercial signal titled "Why Kyle Should Care".
`;

async function analyzeArticle(article: Article): Promise<Omit<IntelligenceItem, 'id' | 'article_id' | 'analyzed_at'>> {
  if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    console.warn("No NEXT_PUBLIC_OPENAI_API_KEY found, skipping actual analysis and returning dummy data.");
    return {
      territory_id: "unassigned",
      relevance_score: 50,
      category: ["Mock"],
      summary: "Mock summary due to missing API key.",
      stakeholders: [],
      commercial_signal: "Why Kyle Should Care: N/A",
      recommendations: ["Set NEXT_PUBLIC_OPENAI_API_KEY"]
    };
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
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
  const articles = await loadFile<Article>(ARTICLES_FILE);
  const intelligenceItems = await loadFile<IntelligenceItem>(INTELLIGENCE_FILE);
  
  const analyzedArticleIds = new Set(intelligenceItems.map(i => i.article_id));
  const newItems: IntelligenceItem[] = [];

  for (const article of articles) {
    if (!analyzedArticleIds.has(article.id)) {
      console.log(`Analyzing: ${article.title}`);
      try {
        const analysis = await analyzeArticle(article);
        const item: IntelligenceItem = {
          id: `intel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          article_id: article.id,
          analyzed_at: new Date().toISOString(),
          ...analysis
        };
        newItems.push(item);
      } catch (error) {
        console.error(`Failed to analyze article ${article.id}:`, error);
      }
    }
  }

  if (newItems.length > 0) {
    console.log(`Successfully analyzed ${newItems.length} new articles.`);
    await saveFile(INTELLIGENCE_FILE, [...intelligenceItems, ...newItems]);
  } else {
    console.log('No new articles to analyze.');
  }
}

runAnalysis().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
