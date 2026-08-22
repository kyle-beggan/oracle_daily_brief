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
      return `Your estimated commute time from Fredericksburg to Reston is ${minutes} minutes.`;
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

interface IntelligenceItem {
  relevance_score: number;
  [key: string]: unknown;
}

// 4. Generate Content with OpenAI
async function generateContent(weatherStr: string, commuteStr: string, territories: { name: string, logo: string }[], intelligenceData: IntelligenceItem[]) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required for generation.');
  }

  // Filter intelligence to highly relevant ones (e.g. score > 60)
  const relevantIntel = intelligenceData.filter(item => item.relevance_score > 60);
  
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
   - "html": A richly formatted HTML string summarizing the key points for the visual dashboard using standard <ul><li> for the bullet points. Do NOT include any <h3> headers in this string, only the bulleted list. If there is no news, output a single bullet: <li>No significant activity to report today.</li>
   - If an intelligence item has a source URL, you MUST provide a <a href="URL" target="_blank" rel="noopener noreferrer">(link)</a> at the very end of the bullet point.

Here is the context for today:
[Weather]: ${weatherStr}
[Commute]: ${commuteStr}

[My Territories]:
${territories.map((t: { name: string, logo: string }) => `- ${t.name} (Logo URL: ${t.logo})`).join('\n')}

[Intelligence Items]:
${JSON.stringify(relevantIntel, null, 2)}
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
  const generated = await generateContent(weather, commute, territories, intel);
  
  // Save JSON for dashboard
  const briefPayload = {
    date: new Date().toISOString(),
    weather: weather,
    commute: commute,
    territories: generated.territories
  };
  await fs.writeFile(BRIEF_JSON_FILE, JSON.stringify(briefPayload, null, 2));
  console.log(`Saved brief payload to ${BRIEF_JSON_FILE}`);
  
  // Generate Audio
  await generateTTS(generated.podcast_script);
  
  console.log('Generation process complete.');
}

run().catch(console.error);
