import OpenAI from 'openai';
import dotenv from 'dotenv';
import { supabase } from './supabase';

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
  territory_id: string;
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

async function loadArticles(): Promise<Article[]> {
  const { data, error } = await supabase.from('oracle_articles').select('*');
  if (error) throw error;
  return data as Article[];
}

async function loadAnalyzedArticleIds(): Promise<Set<string>> {
  const { data, error } = await supabase.from('oracle_intelligence').select('article_id');
  if (error) throw error;
  return new Set(data.map((i: { article_id: string }) => i.article_id));
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
      commercial_signal: "Why Kyle Should Care: N/A",
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
Include a commercial signal titled "Why Kyle Should Care".
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
  const articles = await loadArticles();
  const analyzedArticleIds = await loadAnalyzedArticleIds();
  const territories = await loadTerritories();
  
  const territoriesList = territories.map(t => `${t.id}: ${t.name}`).join('\n');
  const newItems: IntelligenceItem[] = [];

  for (const article of articles) {
    if (!analyzedArticleIds.has(article.id)) {
      console.log(`Analyzing: ${article.title}`);
      try {
        const analysis = await analyzeArticle(article, territoriesList);
        const item: IntelligenceItem = {
          id: `intel_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          article_id: article.id,
          analyzed_at: new Date().toISOString(),
          ...analysis
        };
        newItems.push(item);
        
        // Save dynamically to prevent memory issues if there are hundreds of articles
        if (newItems.length >= 10) {
          console.log(`Saving batch of ${newItems.length} items to Supabase...`);
          await saveIntelligence(newItems);
          newItems.length = 0; // clear array
        }
      } catch (error) {
        console.error(`Failed to analyze article ${article.id}:`, error);
      }
    }
  }

  if (newItems.length > 0) {
    console.log(`Saving remaining ${newItems.length} items to Supabase...`);
    await saveIntelligence(newItems);
  }
  
  console.log('Intelligence analysis pipeline complete.');
}

runAnalysis().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
