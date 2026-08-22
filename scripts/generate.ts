import fs from 'fs/promises';
import path from 'path';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const DATA_DIR = path.join(process.cwd(), 'data');
const PUBLIC_DATA_DIR = path.join(process.cwd(), 'public', 'data');
const INTELLIGENCE_FILE = path.join(DATA_DIR, 'intelligence.json');
const TERRITORIES_FILE = path.join(DATA_DIR, 'territories.json');
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json');
const SOURCES_FILE = path.join(DATA_DIR, 'sources.json');
const BRIEF_JSON_FILE = path.join(PUBLIC_DATA_DIR, 'daily-brief.json');
const PODCAST_AUDIO_FILE = path.join(PUBLIC_DATA_DIR, 'podcast.mp3');

// Ensure public/data exists
async function ensureDirs() {
  await fs.mkdir(PUBLIC_DATA_DIR, { recursive: true });
}

// 1. Fetch Weather for Northern Virginia
async function fetchWeather() {
  try {
    // Latitude/Longitude for Northern Virginia area (e.g., Reston)
    const lat = 38.9687;
    const lon = -77.3411;
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`);
    const data = await response.json();
    const temp = data.current_weather.temperature;
    return `The current temperature in Northern Virginia is ${temp} degrees Fahrenheit.`;
  } catch (error) {
    console.error('Error fetching weather:', error);
    return 'The weather forecast is currently unavailable.';
  }
}

// 2. Fetch Commute Time (Fredericksburg to Reston)
async function fetchCommuteTime() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.warn('No GOOGLE_MAPS_API_KEY found, returning placeholder commute time.');
    return 'Your estimated commute time is currently unavailable.';
  }
  
  try {
    const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'routes.duration'
      },
      body: JSON.stringify({
        origin: { address: 'Fredericksburg, VA' },
        destination: { address: 'Reston, VA' },
        travelMode: 'DRIVE',
        routingPreference: 'TRAFFIC_AWARE'
      })
    });
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      const durationSeconds = parseInt(data.routes[0].duration.replace('s', ''));
      const minutes = Math.floor(durationSeconds / 60);
      
      // Calculate arrival time
      const arrivalDate = new Date(Date.now() + durationSeconds * 1000);
      const arrivalTime = arrivalDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

      return `Your estimated commute time from Fredericksburg to Reston is ${minutes} minutes. If you leave right now, you will arrive at ${arrivalTime}.`;
    } else {
      console.warn('Google Maps API returned unexpected data:', data);
      return 'Your estimated commute time could not be calculated.';
    }
  } catch (error) {
    console.error('Error fetching commute time:', error);
    return 'Your estimated commute time could not be calculated due to an error.';
  }
}

// 3. Load Intelligence Data
async function loadIntelligence() {
  try {
    const data = await fs.readFile(INTELLIGENCE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as { code?: string }).code === 'ENOENT') return [];
    throw error;
  }
}

async function loadTerritories() {
  try {
    const data = await fs.readFile(TERRITORIES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as { code?: string }).code === 'ENOENT') return [];
    throw error;
  }
}


async function loadArticles() {
  try {
    const data = await fs.readFile(ARTICLES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as { code?: string }).code === 'ENOENT') return [];
    throw error;
  }
}

async function loadSources() {
  try {
    const data = await fs.readFile(SOURCES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as { code?: string }).code === 'ENOENT') return [];
    throw error;
  }
}

interface IntelligenceItem {
  relevance_score: number;
  article_id: string;
  territory_id: string;
  category: string[];
  summary: string;
  stakeholders: string[];
  commercial_signal: string;
  recommendations: string[];
  analyzed_at: string;
}

interface Article {
  id: string;
  source_id: string;
  url: string;
  title: string;
  published_at: string;
}

interface Source {
  id: string;
  name: string;
}

// 4. Generate Content with OpenAI
async function generateContent(weatherStr: string, commuteStr: string, territories: { name: string, logo: string }[], intelligenceData: IntelligenceItem[], articles: Article[], sources: Source[]) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required for generation.');
  }

  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const articleMap = new Map(articles.map(a => [a.id, a]));
  const sourceMap = new Map(sources.map(s => [s.id, s]));

  const enrichedIntel = intelligenceData
    .filter(item => item.relevance_score > 60)
    .map(item => {
      const article = articleMap.get(item.article_id as string);
      return { ...item, article };
    })
    .filter(item => {
      if (!item.article || !item.article.published_at) return false;
      const pubDate = new Date(item.article.published_at).getTime();
      return (now - pubDate) <= SEVEN_DAYS_MS;
    })
    .map(item => {
      const source = item.article ? sourceMap.get(item.article.source_id) : undefined;
      return {
        territory_id: item.territory_id,
        category: item.category,
        summary: item.summary,
        relevance_score: item.relevance_score,
        title: item.article!.title,
        url: item.article!.url,
        published_at: item.article!.published_at,
        source_name: source ? source.name : "Unknown Source"
      };
    })
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

  const systemPrompt = `
You are the host of a daily podcast and executive briefing for Kyle, an Oracle Federal Cloud Account Executive.
Your task is to review the following intelligence items and produce a JSON response containing two things:
1. "podcast_script": A spoken-word script that you will read. 
   - MUST start exactly with: "Good morning, Kyle."
   - MUST then include the provided weather and commute updates.
   - MUST then smoothly transition into a concise, engaging summary of the most important news.
   - MUST STRICTLY EXCLUDE any political partisan drama. Focus ONLY on executive orders, legislation, and updates that have a direct effect on selling Oracle technology and services.
   - The script must be concise enough to be spoken in under 20 minutes (maximum 2500 words).
   - Keep the tone professional, energetic, and highly relevant to Oracle sales.
2. "territories": An array of objects for each of my territories in the EXACT same order they are listed in the [My Territories] context.
   - "name": The exact name of the territory from the context.
   - "logo": The exact logo URL of the territory from the context.
   - "html": A richly formatted HTML string summarizing the key points for the visual dashboard using standard <ul><li> for the bullet points. Do NOT include any <h3> headers in this string, only the bulleted list. If there is no news for a territory within the last 7 days, output a single bullet: <li>No significant activity to report this week.</li>
   - Order the bullets with the most recent news on top.
   - IMPORTANT: If an intelligence item has a source URL, you MUST provide the source name and link at the very end of the bullet point in this exact format: <code>(Source Name - <a href="URL" target="_blank" rel="noopener noreferrer">link</a>)</code>.
   - 

Here is the context for today:
[Weather]: ${weatherStr}
[Commute]: ${commuteStr}

[My Territories]:
${territories.map((t: { name: string, logo: string }) => `- ${t.name} (Logo URL: ${t.logo})`).join('\n')}

[Intelligence Items]:
${JSON.stringify(enrichedIntel, null, 2)}
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: "Generate today's brief." }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "daily_generation",
        schema: {
          type: "object",
          properties: {
            podcast_script: { type: "string" },
            territories: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  logo: { type: "string" },
                  html: { type: "string" }
                },
                required: ["name", "logo", "html"],
                additionalProperties: false
              }
            }
          },
          required: ["podcast_script", "territories"],
          additionalProperties: false
        },
        strict: true
      }
    }
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("No content generated");
  
  return JSON.parse(content);
}

// 5. Generate TTS Audio
async function generateTTS(script: string) {
  console.log('Generating TTS Audio...');
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: script,
  });
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.writeFile(PODCAST_AUDIO_FILE, buffer);
  console.log(`Saved podcast audio to ${PODCAST_AUDIO_FILE}`);
}

async function run() {
  console.log('Starting daily generation process...');
  await ensureDirs();
  
  const weather = await fetchWeather();
  console.log('Weather:', weather);
  
  const commute = await fetchCommuteTime();
  console.log('Commute:', commute);
  
  const intel = await loadIntelligence();
  console.log(`Loaded ${intel.length} intelligence items.`);

  const territories = await loadTerritories();
  
  console.log('Generating content via OpenAI...');
  const articles = await loadArticles();
  const sources = await loadSources();
  const generated = await generateContent(weather, commute, territories, intel, articles, sources);
  
  // Merge AI output with master territories list to ensure no territories are dropped
  const mergedTerritories = territories.map(t => {
    const aiMatch = generated.territories.find((g: { name: string, logo: string, html: string }) => g.name === t.name);
    return {
      name: t.name,
      logo: t.logo,
      html: aiMatch ? aiMatch.html : "<ul><li>No significant activity to report this week.</li></ul>"
    };
  });
  
  // Save JSON for dashboard
  const briefPayload = {
    date: new Date().toISOString(),
    weather: weather,
    commute: commute,
    territories: mergedTerritories,
    podcast_script: generated.podcast_script
  };
  await fs.writeFile(BRIEF_JSON_FILE, JSON.stringify(briefPayload, null, 2));
  console.log(`Saved brief payload to ${BRIEF_JSON_FILE}`);
  
  // Generate Audio
  await generateTTS(generated.podcast_script);
  
  console.log('Generation process complete.');
}

run().catch(console.error);
