"use client";

import { useEffect, useState } from "react";
import { Bot, ArrowLeft } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function NetworkingPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [networkingEvents, setNetworkingEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [targetAgencies, setTargetAgencies] = useState<string[]>(["DHS"]);
  const [locations, setLocations] = useState<string[]>(["Washington, DC", "McLean, VA"]);
  const [topics, setTopics] = useState<string[]>(["Federal IT", "Defense", "Homeland Security"]);

  const allAgencies = ["DHS", "CISA", "FEMA", "TSA", "ICE", "CBP", "USSS"];
  const allLocations = ["Washington, DC", "McLean, VA", "Bethesda, MD", "Arlington, VA", "Alexandria, VA", "Reston, VA", "Herndon, VA"];
  const allTopics = ["Federal IT", "Defense", "Homeland Security", "Cloud", "Data", "Cybersecurity", "AI", "Procurement"];

  const toggleSelection = (setState: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setState(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleSelectAll = (setState: React.Dispatch<React.SetStateAction<string[]>>, allValues: string[], currentValues: string[]) => {
    if (currentValues.length === allValues.length) {
      setState([]);
    } else {
      setState(allValues);
    }
  };
  const [isIngesting, setIsIngesting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showScoring, setShowScoring] = useState(false);

  const fetchEvents = async () => {
    setIsLoading(true);
    const { data: events, error: eventsError } = await supabase
      .from('oracle_networking_events')
      .select('*')
      .order('event_date', { ascending: true });
      
    if (eventsError) {
      console.error("Could not load networking events", eventsError);
    } else {
      setNetworkingEvents(events || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEvents();
  }, []);

  const runIngestion = async () => {
    setIsIngesting(true);
    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          targetAgency: targetAgencies.join(', '), 
          location: locations.join(', '), 
          topics: topics.join(', ') 
        })
      });
      if(res.ok) {
        await fetchEvents();
        setShowSettings(false);
      }
    } catch(e) {
      console.error(e);
    }
    setIsIngesting(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-rose-500/30 p-6 md:p-12">
      <div className="fixed top-[-50%] left-[-20%] w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-950 to-zinc-950 -z-10 blur-3xl pointer-events-none" />

      <div className="max-w-[1224px] mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-300 transition-colors shadow-xl backdrop-blur-md">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">DHS Networking Opportunities</h1>
              <p className="text-zinc-400 mt-1 text-sm">Upcoming events relevant to your territories</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowScoring(!showScoring)}
              className="px-4 py-2 bg-zinc-800/30 hover:bg-zinc-800 border border-zinc-700/50 rounded-lg text-sm font-semibold text-zinc-400 hover:text-zinc-300 transition-colors"
            >
              {showScoring ? 'Hide Scoring Info' : 'How is this scored?'}
            </button>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 rounded-lg text-sm font-semibold text-zinc-300 transition-colors"
            >
              {showSettings ? 'Hide Parameters' : 'Adjust Search Parameters'}
            </button>
          </div>
        </div>

        {showScoring && (
          <div className="mb-8 p-6 bg-zinc-900/60 border border-zinc-700/50 rounded-xl backdrop-blur-md shadow-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-sky-400 mb-2">Networking Score (0-100)</h2>
              <p className="text-sm text-zinc-300 leading-relaxed">
                The Networking Score is calculated by our AI engine based on three key factors: relevance to your Target Agencies, alignment with your Topic Focus, and the presence of confirmed government speakers. A score closer to 100 indicates a highly valuable in-person networking opportunity.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800">
                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Tier 1
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Must-attend events. Highly relevant, confirmed senior government/agency speakers, and direct, high-value networking opportunities.
                </p>
              </div>
              <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800">
                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> Tier 2
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Recommended events. Good topic alignment and potential agency presence. Valuable for general industry networking.
                </p>
              </div>
              <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800">
                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Tier 3
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Lower priority. General tech events without a specific focus on your target agencies, or virtual events with limited networking.
                </p>
              </div>
              <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800">
                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span> Watchlist
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Keep an eye on these. Dates, venues, or speakers might still be TBD, but the event historically provides high value.
                </p>
              </div>
            </div>
          </div>
        )}

        {showSettings && (
          <div className="mb-8 p-6 bg-zinc-900/80 border border-zinc-700/50 rounded-xl backdrop-blur-md shadow-2xl">
            <h2 className="text-lg font-bold text-zinc-100 mb-4">Discovery Engine Parameters</h2>
            <p className="text-sm text-zinc-400 mb-6">Change the criteria the AI uses to search for new events, then trigger a discovery run.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
              <div>
                <div className="flex justify-between items-baseline mb-4 border-b border-zinc-800 pb-2">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Target Agency</label>
                  <button 
                    onClick={() => handleSelectAll(setTargetAgencies, allAgencies, targetAgencies)}
                    className="text-[10px] font-semibold text-sky-400 hover:text-sky-300 transition-colors uppercase tracking-wider"
                  >
                    {targetAgencies.length === allAgencies.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div className="space-y-2">
                  {allAgencies.map(agency => (
                    <label key={agency} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={targetAgencies.includes(agency)}
                        onChange={() => toggleSelection(setTargetAgencies, agency)}
                        className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-sky-500 focus:ring-sky-500 focus:ring-offset-zinc-950"
                      />
                      <span className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors">{agency}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-baseline mb-4 border-b border-zinc-800 pb-2">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Location Scope</label>
                  <button 
                    onClick={() => handleSelectAll(setLocations, allLocations, locations)}
                    className="text-[10px] font-semibold text-sky-400 hover:text-sky-300 transition-colors uppercase tracking-wider"
                  >
                    {locations.length === allLocations.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div className="space-y-2">
                  {allLocations.map(loc => (
                    <label key={loc} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={locations.includes(loc)}
                        onChange={() => toggleSelection(setLocations, loc)}
                        className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-sky-500 focus:ring-sky-500 focus:ring-offset-zinc-950"
                      />
                      <span className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors">{loc}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-baseline mb-4 border-b border-zinc-800 pb-2">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Topic Focus</label>
                  <button 
                    onClick={() => handleSelectAll(setTopics, allTopics, topics)}
                    className="text-[10px] font-semibold text-sky-400 hover:text-sky-300 transition-colors uppercase tracking-wider"
                  >
                    {topics.length === allTopics.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div className="space-y-2">
                  {allTopics.map(topic => (
                    <label key={topic} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={topics.includes(topic)}
                        onChange={() => toggleSelection(setTopics, topic)}
                        className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-sky-500 focus:ring-sky-500 focus:ring-offset-zinc-950"
                      />
                      <span className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors">{topic}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                onClick={runIngestion}
                disabled={isIngesting}
                className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
              >
                {isIngesting ? (
                  <><div className="animate-spin h-4 w-4 border-2 border-zinc-950 border-t-transparent rounded-full" /> Searching...</>
                ) : (
                  <><Bot className="w-4 h-4" /> Run Discovery Search</>
                )}
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-4 backdrop-blur-md">
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-1">Tier 1</p>
                <p className="text-2xl font-bold text-sky-400">{networkingEvents.filter(e => e.opportunity_tier === 'Tier 1').length}</p>
              </div>
              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-4 backdrop-blur-md">
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-1">DHS Speakers</p>
                <p className="text-2xl font-bold text-sky-400">{networkingEvents.filter(e => e.dhs_participants && e.dhs_participants.length > 0).length}</p>
              </div>
              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-4 backdrop-blur-md">
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-1">This Month</p>
                <p className="text-2xl font-bold text-sky-400">{networkingEvents.filter(e => e.event_date && new Date(e.event_date).getMonth() === new Date().getMonth()).length}</p>
              </div>
              <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-4 backdrop-blur-md">
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-1">New</p>
                <p className="text-2xl font-bold text-sky-400">{networkingEvents.filter(e => {
                    if(!e.date_discovered) return false;
                    const daysOld = (new Date().getTime() - new Date(e.date_discovered).getTime()) / (1000 * 3600 * 24);
                    return daysOld < 7;
                }).length}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {networkingEvents.length > 0 ? networkingEvents.map((ev, i) => (
                <div key={i} className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-6 hover:border-sky-500/50 transition-colors shadow-xl flex flex-col">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                      <h4 className="text-xl font-bold text-zinc-100">{ev.name}</h4>
                      <p className="text-sm text-zinc-400 mt-2 font-medium">
                        {ev.event_date ? new Date(ev.event_date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }) : 'Date TBD'} &bull; {ev.venue || 'Virtual/TBD'} &bull; {ev.format || ev.event_type}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-right bg-zinc-950/50 p-3 rounded-xl border border-zinc-800 shrink-0">
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-0.5 whitespace-nowrap">Tier</div>
                        <div className="text-zinc-200 font-bold text-xs whitespace-nowrap">{ev.opportunity_tier}</div>
                      </div>
                      <div className="h-8 w-px bg-zinc-800 shrink-0"></div>
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-0.5 whitespace-nowrap">Score</div>
                        <div className="text-sky-400 font-bold text-lg leading-none whitespace-nowrap">{ev.networking_score}</div>
                      </div>
                    </div>
                  </div>
                  
                  {ev.why_it_matters && (
                    <div className="mt-5 p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
                      <p className="text-sm text-zinc-300 italic leading-relaxed">&quot;{ev.why_it_matters}&quot;</p>
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap gap-2">
                    {ev.topics && ev.topics.map((t: string, ti: number) => (
                      <span key={ti} className="px-2.5 py-1 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-md text-[10px] uppercase font-semibold tracking-wider">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-6 flex gap-3">
                    {ev.event_url && (
                      <a href={ev.event_url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-zinc-950 text-sm font-semibold rounded-lg transition-colors shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                        View Event Details
                      </a>
                    )}
                  </div>
                </div>
              )) : (
                <div className="md:col-span-2 text-center py-20 bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-zinc-800/50 border-dashed">
                  <Bot className="h-10 w-10 text-zinc-600 mx-auto mb-4" />
                  <p className="text-zinc-300 font-medium text-lg">No networking events discovered yet.</p>
                  <p className="text-zinc-500 text-sm mt-2">Run the ingestion pipeline to discover opportunities.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
