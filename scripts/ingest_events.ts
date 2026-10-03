import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { supabase } from './supabase';

dotenv.config({ path: path.join(process.cwd(), '.env.local'), override: true });

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

const SOURCES = [
  { name: 'AFCEA DC', url: 'https://dc.afceachapters.org/' },
  // { name: 'GovConWire', url: 'https://www.govconwire.com/events/' }, // often blocked by WAF
];

async function fetchHtmlText(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    });
    const text = await res.text();
    // basic strip of script and style tags to reduce token count
    return text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
               .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
               .replace(/<[^>]+>/g, ' ')
               .replace(/\s+/g, ' ')
               .slice(0, 30000); // truncate to ~30k chars
  } catch (e) {
    console.error(`Failed to fetch ${url}:`, e);
    return '';
  }
}

async function extractEvents(sourceName: string, sourceUrl: string, rawText: string) {
  if (!rawText) return [];
  console.log(`Extracting events from ${sourceName}...`);
  
  const prompt = `
You are an expert federal technology networking analyst.
Extract upcoming events relevant to federal IT, defense, and homeland security from the following text.
Specifically look for events in the Washington DC area.
Identify any DHS (Department of Homeland Security) involvement if mentioned.

Text source: ${sourceName}
URL: ${sourceUrl}

Raw Text:
${rawText}

Return a JSON object containing an array of "events" with these keys:
- name: string
- event_type: string (e.g. Conference, Symposium, Networking, Workshop)
- event_date: ISO 8601 string or null
- venue: string or null
- city: string or null
- format: "Virtual" | "Hybrid" | "In-Person"
- description: string
- topics: array of strings
- dhs_participants: array of strings (names/titles of DHS speakers)
- networking_score: integer (0-100, where 100 is excellent DHS tech networking)
- opportunity_tier: "Tier 1" | "Tier 2" | "Tier 3" | "Watchlist"
- score_explanation: string
- why_it_matters: string (Why this matters for DHS networking)
- source_evidence: array of strings (URLs or facts found in text)
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: "You extract structured event data. Output valid JSON." },
      { role: "user", content: prompt }
    ]
  });

  const content = response.choices[0].message.content;
  if (!content) return [];

  const data = JSON.parse(content);
  return data.events || [];
}

async function ingest() {
  for (const source of SOURCES) {
    const rawText = await fetchHtmlText(source.url);
    const events = await extractEvents(source.name, source.url, rawText);
    
    console.log(`Found ${events.length} events from ${source.name}`);
    
    for (const event of events) {
      console.log(`Inserting: ${event.name}`);
      const { error } = await supabase
        .from('oracle_networking_events')
        .insert({
          name: event.name,
          event_type: event.event_type,
          event_date: event.event_date ? new Date(event.event_date).toISOString() : null,
          venue: event.venue,
          city: event.city,
          format: event.format,
          description: event.description,
          topics: event.topics,
          dhs_participants: event.dhs_participants,
          networking_score: event.networking_score,
          opportunity_tier: event.opportunity_tier,
          score_explanation: event.score_explanation,
          why_it_matters: event.why_it_matters,
          source_evidence: event.source_evidence,
          source: source.name,
          event_url: source.url, // Using source URL as fallback
          date_discovered: new Date().toISOString()
        });
        
      if (error) {
        console.error('Failed to insert event:', error);
      }
    }
  }
  console.log("Ingestion complete.");
}

ingest().catch(console.error);
