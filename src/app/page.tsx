"use client";

import { useEffect, useState } from "react";
import { Play, Pause, FileText, Activity, ShieldAlert, Cpu } from "lucide-react";

interface BriefData {
  date: string;
  executive_summary: string;
}

export default function Home() {
  const [data, setData] = useState<BriefData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Fetch static data on mount
    fetch("/data/daily-brief.json")
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error("Could not load brief data", err));
      
    // Initialize audio
    const podcastAudio = new Audio("/data/podcast.mp3");
    podcastAudio.addEventListener("ended", () => setIsPlaying(false));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAudio(podcastAudio);

    return () => {
      podcastAudio.pause();
      podcastAudio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, []);

  const togglePlay = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formattedDate = data?.date ? new Date(data.date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }) : new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-rose-500/30">
      {/* Background ambient light */}
      <div className="fixed top-[-50%] left-[-20%] w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-950 to-zinc-950 -z-10 blur-3xl pointer-events-none" />

      <main className="max-w-5xl mx-auto px-6 py-12 md:py-24">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-rose-500"></span>
              <span className="text-sm font-semibold tracking-widest text-rose-500 uppercase">Oracle Federal Cloud</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-2">Daily Brief</h1>
            <p className="text-lg text-zinc-400">{formattedDate}</p>
          </div>
          
          {/* Audio Player Card */}
          <div className="w-full md:w-auto bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-4 flex items-center gap-4 hover:border-zinc-700 transition-colors shadow-2xl">
            <button 
              onClick={togglePlay}
              className="h-14 w-14 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
            </button>
            <div>
              <h3 className="font-medium text-zinc-100">Morning Podcast</h3>
              <p className="text-sm text-zinc-400">Weather, Commute & Intel</p>
            </div>
            <div className="ml-4 h-8 flex items-end gap-1 px-2">
              <div className={`w-1 bg-rose-500/50 rounded-full ${isPlaying ? 'animate-[bounce_1s_infinite]' : 'h-2'}`}></div>
              <div className={`w-1 bg-rose-500/70 rounded-full ${isPlaying ? 'animate-[bounce_1.2s_infinite]' : 'h-4'}`}></div>
              <div className={`w-1 bg-rose-500/50 rounded-full ${isPlaying ? 'animate-[bounce_0.8s_infinite]' : 'h-1'}`}></div>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                  <FileText className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold">Executive Summary</h2>
              </div>
              
              <div className="prose prose-invert prose-zinc max-w-none">
                {data?.executive_summary ? (
                  <div dangerouslySetInnerHTML={{ __html: data.executive_summary }} />
                ) : (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                    <div className="h-4 bg-zinc-800 rounded w-full"></div>
                    <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
                    <div className="h-4 bg-zinc-800 rounded w-full"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Side Panel Area */}
          <div className="space-y-6">
            {/* Quick Stats Card */}
            <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-6">
               <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Market Signals</h3>
               <ul className="space-y-4">
                 <li className="flex items-start gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 mt-0.5">
                      <Cpu className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">AI Adoption</p>
                      <p className="text-xs text-zinc-400">High relevance in recent DHS RFIs</p>
                    </div>
                 </li>
                 <li className="flex items-start gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 mt-0.5">
                      <ShieldAlert className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Cyber Directives</p>
                      <p className="text-xs text-zinc-400">Zero-Trust mandates accelerating</p>
                    </div>
                 </li>
                 <li className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 mt-0.5">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Cloud Migrations</p>
                      <p className="text-xs text-zinc-400">Steady volume across FEMA</p>
                    </div>
                 </li>
               </ul>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
