import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const SOURCES = [
  { name: 'AFCEA DC', url: 'https://dc.afceachapters.org/' },
];

async function fetchHtmlText(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    });
    const text = await res.text();
    return text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
               .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
               .replace(/<[^>]+>/g, ' ')
               .replace(/\s+/g, ' ')
               .slice(0, 30000); 
  } catch (e) {
    console.error(`Failed to fetch ${url}:`, e);
    return '';
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function extractEvents(sourceName: string, sourceUrl: string, rawText: string, params: any) {
  if (!rawText) return [];
  
  const prompt = `
You are an expert federal technology networking analyst.
Extract upcoming events relevant to ${params.topics} from the following text.
Specifically look for events in the ${params.location}.
Identify any ${params.targetAgency} involvement if mentioned.

Text source: ${sourceName}
URL: ${sourceUrl}

Raw Text:
${rawText}

Return a JSON object containing an array of "events" with these keys:
- name: string
- event_type: string
- event_date: ISO 8601 string or null
- venue: string or null
- city: string or null
- format: "Virtual" | "Hybrid" | "In-Person"
- description: string
- topics: array of strings
- dhs_participants: array of strings (names/titles of ${params.targetAgency} speakers)
- networking_score: integer (0-100)
- opportunity_tier: "Tier 1" | "Tier 2" | "Tier 3" | "Watchlist"
- score_explanation: string
- why_it_matters: string (Why this matters for networking)
- source_evidence: array of strings
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

export async function POST(req: Request) {
  try {
    const params = await req.json();
    let totalFound = 0;

    for (const source of SOURCES) {
      const rawText = await fetchHtmlText(source.url);
      const events = await extractEvents(source.name, source.url, rawText, params);
      
      for (const event of events) {
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
            event_url: source.url,
            date_discovered: new Date().toISOString()
          });
          
        if (!error) totalFound++;
      }
    }

    return NextResponse.json({ success: true, count: totalFound });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
