"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Play, Pause, Activity, ShieldAlert, Cpu, Cloud, Car, RefreshCw } from "lucide-react";

interface TerritoryBrief {
  name: string;
  logo: string;
  html: string;
}

interface BriefData {
  date: string;
  weather?: string;
  commute?: string;
  territories: TerritoryBrief[];
}

export default function Home() {
  const [data, setData] = useState<BriefData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Fetch static data on mount
    fetch("/data/daily-brief.json")
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error("Could not load brief data", err));
      
    // Initialize audio
    const podcastAudio = new Audio("/data/podcast.mp3");
    
    const handleLoadedMetadata = () => setDuration(podcastAudio.duration);
    const handleTimeUpdate = () => setCurrentTime(podcastAudio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    podcastAudio.addEventListener("loadedmetadata", handleLoadedMetadata);
    podcastAudio.addEventListener("timeupdate", handleTimeUpdate);
    podcastAudio.addEventListener("ended", handleEnded);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAudio(podcastAudio);

    return () => {
      podcastAudio.pause();
      podcastAudio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      podcastAudio.removeEventListener("timeupdate", handleTimeUpdate);
      podcastAudio.removeEventListener("ended", handleEnded);
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

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formattedDate = data?.date ? new Date(data.date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }) : new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const lastUpdated = data?.date ? new Date(data.date).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
  }) : 'Unknown';

  const triggerRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    
    const owner = process.env.NEXT_PUBLIC_REPO_OWNER;
    const repo = process.env.NEXT_PUBLIC_REPO_NAME;
    const pat = process.env.NEXT_PUBLIC_GITHUB_PAT;
    
    if (!owner || !repo || !pat) {
      toast.error("GitHub configuration missing in .env.local. Please set NEXT_PUBLIC_REPO_OWNER, NEXT_PUBLIC_REPO_NAME, and NEXT_PUBLIC_GITHUB_PAT.");
      setIsRefreshing(false);
      return;
    }

    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/workflows/pipeline.yml/dispatches`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${pat}`,
          "Accept": "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ref: "main"
        })
      });

      if (response.ok) {
        toast.success("Data pipeline triggered! The site will update in a few minutes.");
      } else {
        const err = await response.text();
        console.error("Failed to trigger pipeline:", err);
        toast.error("Failed to trigger pipeline. Check console.");
      }
    } catch (error) {
      console.error("Error triggering pipeline:", error);
      toast.error("Error triggering pipeline.");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-rose-500/30">
      {/* Background ambient light */}
      <div className="fixed top-[-50%] left-[-20%] w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-950 to-zinc-950 -z-10 blur-3xl pointer-events-none" />

      <main className="max-w-[1224px] mx-auto px-6 py-12 md:py-24">
        
        {/* Header Section */}
        <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-sky-400"></span>
              <span className="text-base font-semibold tracking-widest text-sky-400 uppercase">Oracle Federal Cloud</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-2">Daily Brief</h1>
            <p className="text-xl text-zinc-400">{formattedDate}</p>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="text-xs text-zinc-500 font-medium tracking-wide">Last updated: {lastUpdated}</span>
            <button 
              onClick={triggerRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-sm font-medium text-zinc-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xl backdrop-blur-md"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
              {isRefreshing ? 'Triggering...' : 'Refresh Feed'}
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-6">
            {data?.territories ? data.territories.map((territory, idx) => (
              <div key={idx} className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={territory.logo} alt={territory.name} className="w-8 h-8 opacity-90" />
                  <h3 className="text-2xl font-semibold text-sky-400">{territory.name}</h3>
                </div>
                <div className="prose prose-lg prose-invert max-w-none prose-p:text-zinc-400 prose-li:text-zinc-300 prose-ul:m-0 prose-ul:p-0 prose-li:marker:text-sky-400/70 prose-a:text-sky-400 hover:prose-a:text-sky-300">
                  <div dangerouslySetInnerHTML={{ __html: territory.html }} />
                </div>
              </div>
            )) : (
              <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-8 animate-pulse space-y-4">
                <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                <div className="h-4 bg-zinc-800 rounded w-full"></div>
                <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
              </div>
            )}
          </div>

          {/* Side Panel Area */}
          <div className="space-y-6">
            {/* Audio Player Card */}
            <div className="w-full bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-6 flex flex-col gap-5 hover:border-zinc-700 transition-colors shadow-2xl">
              <div className="flex items-center gap-4">
                <button 
                  onClick={togglePlay}
                  className="h-14 w-14 rounded-full shrink-0 bg-rose-500 hover:bg-rose-600 flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                </button>
                <div className="flex-1">
                  <h3 className="font-medium text-lg text-zinc-100">Morning Podcast</h3>
                  <p className="text-base text-zinc-400">Audio Brief</p>
                </div>
                <div className="h-8 flex items-end gap-1">
                  <div className={`w-1 bg-rose-500/50 rounded-full ${isPlaying ? 'animate-[bounce_1s_infinite]' : 'h-2'}`}></div>
                  <div className={`w-1 bg-rose-500/70 rounded-full ${isPlaying ? 'animate-[bounce_1.2s_infinite]' : 'h-4'}`}></div>
                  <div className={`w-1 bg-rose-500/50 rounded-full ${isPlaying ? 'animate-[bounce_0.8s_infinite]' : 'h-1'}`}></div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full space-y-1.5">
                <div className="flex justify-between text-xs text-zinc-500 font-medium tracking-wide">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div 
                  className="h-1.5 w-full bg-zinc-800/80 rounded-full overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    if (!audio || duration === 0) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    // eslint-disable-next-line react-hooks/immutability
                    audio.currentTime = percent * duration;
                    setCurrentTime(percent * duration);
                  }}
                >
                  <div 
                    className="h-full bg-rose-500 rounded-full transition-all duration-100 ease-linear" 
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Local Conditions Card */}
            <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-6">
               <h3 className="text-base font-semibold text-zinc-400 uppercase tracking-wider mb-4">Local Conditions</h3>
               <ul className="space-y-4">
                 <li className="flex items-start gap-3">
                    <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400 mt-0.5">
                      <Cloud className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-base">Weather</p>
                      <p className="text-sm text-zinc-400">{data?.weather || "Loading..."}</p>
                    </div>
                 </li>
                 <li className="flex items-start gap-3">
                    <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500 mt-0.5">
                      <Car className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-base">Commute</p>
                      <p className="text-sm text-zinc-400">{data?.commute || "Loading..."}</p>
                    </div>
                 </li>
               </ul>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-6">
               <h3 className="text-base font-semibold text-zinc-400 uppercase tracking-wider mb-4">Market Signals</h3>
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
