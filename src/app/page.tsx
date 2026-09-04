"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Play, Pause, Activity, ShieldAlert, Cpu, Cloud, Car, RefreshCw, Link as LinkIcon } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface User {
  id: string;
  name: string;
}

interface TerritoryBrief {
  name: string;
  logo: string;
  html: string;
  mission?: string;
  tech_priorities?: string[];
  prime_contractors?: string[];
  leadership?: Record<string, string | { name: string; url?: string } | Array<string | { name: string; url?: string }>>;
  locations?: { name: string; address: string; map_url: string }[];
}

interface BriefData {
  date: string;
  weather?: string;
  commute?: string;
  territories: TerritoryBrief[];
  podcast_script?: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [briefsMap, setBriefsMap] = useState<Record<string, BriefData>>({});
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshTimeLeft, setRefreshTimeLeft] = useState<number | null>(null);
  const [showScript, setShowScript] = useState(false);
  const [refreshingTerritories, setRefreshingTerritories] = useState<Set<string>>(new Set());
  const [sourcesData, setSourcesData] = useState<Array<{ name: string; url: string; [key: string]: unknown }>>([]);

  const data = selectedUser ? briefsMap[selectedUser] : null;

  useEffect(() => {
    async function fetchData() {
      // Fetch users
      const { data: userData, error: userError } = await supabase
        .from('oracle_users')
        .select('*')
        .order('name');
      
      if (userError) {
        console.error("Could not load users", userError);
      } else {
        setUsers(userData);
        if (userData.length > 0) setSelectedUser(userData.find(u => u.name === 'Kyle Beggan')?.id || userData[0].id);
      }

      // Fetch all recent briefs
      const { data: briefsData, error: briefsError } = await supabase
        .from('oracle_daily_briefs')
        .select('*')
        .order('date', { ascending: false })
        .limit(20);

      if (briefsError) {
        console.error("Could not load briefs data", briefsError);
      } else {
        const bMap: Record<string, BriefData> = {};
        for (const b of briefsData) {
          if (!bMap[b.user_id]) {
            bMap[b.user_id] = b;
          }
        }
        setBriefsMap(bMap);
      }
      
      // Fetch sources
      const { data: sources, error: sourcesError } = await supabase
        .from('oracle_sources')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });
        
      if (sourcesError) {
        console.error("Could not load sources data", sourcesError);
      } else {
        setSourcesData(sources);
      }
    }
    
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;
    
    // In dev, sometimes the file might not exist yet, we catch errors gracefully by adding listeners
    const podcastAudio = new Audio(`/data/podcast_${selectedUser}.mp3`);
    
    const handleLoadedMetadata = () => setDuration(podcastAudio.duration);
    const handleTimeUpdate = () => setCurrentTime(podcastAudio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    podcastAudio.addEventListener("loadedmetadata", handleLoadedMetadata);
    podcastAudio.addEventListener("timeupdate", handleTimeUpdate);
    podcastAudio.addEventListener("ended", handleEnded);

    setAudio(podcastAudio);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    return () => {
      podcastAudio.pause();
      podcastAudio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      podcastAudio.removeEventListener("timeupdate", handleTimeUpdate);
      podcastAudio.removeEventListener("ended", handleEnded);
    };
  }, [selectedUser]);

  useEffect(() => {
    if (refreshTimeLeft === null) return;
    
    if (refreshTimeLeft <= 0) {
      setRefreshTimeLeft(null);
      setIsRefreshing(false);
      window.location.reload();
      return;
    }
    
    const timer = setInterval(() => {
      setRefreshTimeLeft(prev => prev !== null ? prev - 1 : null);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [refreshTimeLeft]);

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
        toast.success("Data pipeline triggered! The site will update in ~7.5 minutes.");
        setRefreshTimeLeft(450);
      } else {
        const err = await response.text();
        console.error("Failed to trigger pipeline:", err);
        toast.error("Failed to trigger pipeline. Check console.");
        setIsRefreshing(false);
      }
    } catch (error) {
      console.error("Error triggering pipeline:", error);
      toast.error("Error triggering pipeline.");
      setIsRefreshing(false);
    }
  };

  const refreshSingleTerritory = async (territoryName: string) => {
    if (refreshingTerritories.has(territoryName) || !selectedUser) return;
    
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      toast.error("OpenAI API key missing. Set NEXT_PUBLIC_OPENAI_API_KEY in .env.local");
      return;
    }

    setRefreshingTerritories(prev => new Set(prev).add(territoryName));
    toast("Refreshing data for " + territoryName + "...");

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: "You are an elite federal market analyst. Return a JSON object containing updated real-time information for the requested territory. Format: {\"newsHtml\": \"<ul><li>...</li></ul>\", \"techPriorities\": [\"...\"], \"primeContractors\": [\"...\"], \"leadership\": {\"CIO\": {\"name\": \"...\", \"url\": \"https://linkedin.com/...\"}, \"CDO\": {\"name\": \"...\"}}}. If a profile URL (like LinkedIn or official gov site) is available for a leader, include it."
            },
            {
              role: "user",
              content: `Generate updated news (HTML bullets), tech priorities, prime contractors, and leadership for ${territoryName}.`
            }
          ]
        })
      });

      if (!response.ok) throw new Error("OpenAI request failed");
      
      const resData = await response.json();
      const content = JSON.parse(resData.choices[0].message.content);

      setBriefsMap(prev => {
        const currentBrief = prev[selectedUser];
        if (!currentBrief) return prev;
        
        return {
          ...prev,
          [selectedUser]: {
            ...currentBrief,
            territories: currentBrief.territories.map(t => {
              if (t.name === territoryName) {
                return {
                  ...t,
                  html: content.newsHtml || t.html,
                  tech_priorities: content.techPriorities || t.tech_priorities,
                  prime_contractors: content.primeContractors || t.prime_contractors,
                  leadership: content.leadership || t.leadership
                };
              }
              return t;
            })
          }
        };
      });

      toast.success(territoryName + " updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to refresh " + territoryName);
    } finally {
      setRefreshingTerritories(prev => {
        const next = new Set(prev);
        next.delete(territoryName);
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-rose-500/30">
      <div className="fixed top-[-50%] left-[-20%] w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-950 to-zinc-950 -z-10 blur-3xl pointer-events-none" />

      <main className="max-w-[1224px] mx-auto px-6 py-12 md:py-24">
        
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-sky-400"></span>
              <span className="text-base font-semibold tracking-widest text-sky-400 uppercase">Oracle Federal Cloud</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-2">Daily Brief</h1>
            <p className="text-xl text-zinc-400">{formattedDate}</p>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-2 min-w-[240px]">
            <span className="text-xs text-zinc-500 font-medium tracking-wide">Last updated: {lastUpdated}</span>
            {refreshTimeLeft !== null ? (
              <div className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg p-3 shadow-xl backdrop-blur-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold tracking-wide text-sky-400 uppercase animate-pulse">Running Pipeline...</span>
                  <span className="text-xs text-zinc-400 font-medium">
                    {Math.floor(refreshTimeLeft / 60)}:{(refreshTimeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-sky-500 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${((450 - refreshTimeLeft) / 450) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <button 
                onClick={triggerRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-sm font-medium text-zinc-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xl backdrop-blur-md w-full justify-center md:w-auto md:justify-start"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
                {isRefreshing ? 'Triggering...' : 'Refresh Feed'}
              </button>
            )}
          </div>
        </header>

        {/* User Tabs */}
        {users.length > 0 && (
          <Tabs value={selectedUser || undefined} onValueChange={setSelectedUser} className="w-full mb-12">
            <TabsList className="flex w-full overflow-x-auto bg-zinc-900/40 border border-zinc-800/50 p-1 rounded-xl gap-1">
              {users.map(u => (
                <TabsTrigger key={u.id} value={u.id} className="flex-1 basis-0 text-zinc-400 [&:not([data-active])]:hover:text-sky-400 rounded-lg data-active:bg-sky-400 data-active:text-black font-semibold">
                  {u.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        <div className="flex flex-col md:grid md:grid-cols-3 gap-6">
          
          <div className="contents md:flex md:flex-col md:gap-6">
            <div className="order-1 md:order-none w-full bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-6 flex flex-col gap-5 hover:border-zinc-700 transition-colors shadow-2xl">
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

              {data?.podcast_script && (
                <div className="w-full mt-2">
                  <button 
                    onClick={() => setShowScript(!showScript)}
                    className="text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors w-full text-center py-2 border border-zinc-800/50 rounded-lg hover:bg-zinc-800/30"
                  >
                    {showScript ? 'Hide Script' : 'Read Script'}
                  </button>
                  {showScript && (
                    <div className="mt-4 p-4 bg-zinc-900/60 rounded-xl border border-zinc-800/50 text-sm text-zinc-300 leading-relaxed max-h-64 overflow-y-auto">
                      {data.podcast_script.split('\n').map((paragraph, i) => (
                        <p key={i} className="mb-3 last:mb-0">{paragraph}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="order-3 md:order-none bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-6">
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

            <div className="order-4 md:order-none bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-6">
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
                      <p className="text-xs text-zinc-400">Steady volume across accounts</p>
                    </div>
                 </li>
               </ul>
            </div>

            <div className="order-5 md:order-none bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-6">
               <h3 className="text-base font-semibold text-zinc-400 uppercase tracking-wider mb-4">Data Sources</h3>
               <ul className="space-y-3">
                 {sourcesData.map((source, idx) => {
                   let rootUrl = source.url;
                   try {
                     rootUrl = new URL(source.url).origin;
                   } catch {
                     // fallback
                   }
                   
                   const isPaywalled = ['nyt us news', 'washington post national', 'govly'].includes(source.name.trim().toLowerCase());
                   
                   return (
                     <li key={idx} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3 truncate">
                          <div className={`p-1.5 bg-zinc-800/50 rounded-lg transition-colors ${isPaywalled ? 'text-amber-500/70 group-hover:text-amber-400' : 'text-zinc-500 group-hover:text-sky-400'}`}>
                            <LinkIcon className="h-3 w-3" />
                          </div>
                          <a 
                            href={rootUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`text-sm font-medium transition-colors truncate ${isPaywalled ? 'text-amber-100/80 hover:text-amber-400' : 'text-zinc-300 hover:text-sky-400'}`}
                          >
                            {source.name}
                          </a>
                        </div>
                        {isPaywalled && (
                          <div className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20 whitespace-nowrap ml-3">
                            Subscription
                          </div>
                        )}
                     </li>
                   );
                 })}
               </ul>
            </div>
          </div>
          
          <div className="order-2 md:order-none md:col-span-2 space-y-6">
            {data?.territories ? data.territories.map((territory, idx) => (
              <div key={idx} className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <img src={territory.logo} alt={territory.name} className="w-8 h-8 opacity-90" />
                    <h3 className="text-2xl font-semibold text-sky-400">{territory.name}</h3>
                  </div>
                  <button
                    onClick={() => refreshSingleTerritory(territory.name)}
                    disabled={refreshingTerritories.has(territory.name)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-sm font-medium text-zinc-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xl backdrop-blur-md w-full justify-center sm:w-auto"
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshingTerritories.has(territory.name) ? 'animate-spin text-sky-400' : ''}`} />
                    {refreshingTerritories.has(territory.name) ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>
                
                <Tabs defaultValue="news" className="w-full">
                  <TabsList className="flex w-full overflow-x-auto bg-zinc-950/50 border border-zinc-800/50 mb-6 p-1 rounded-xl gap-1">
                    <TabsTrigger value="news" className="flex-1 basis-0 text-zinc-400 [&:not([data-active])]:hover:text-sky-400 rounded-lg data-active:bg-sky-400 data-active:text-black">Latest News</TabsTrigger>
                    <TabsTrigger value="mission" className="flex-1 basis-0 text-zinc-400 [&:not([data-active])]:hover:text-sky-400 rounded-lg data-active:bg-sky-400 data-active:text-black">Mission</TabsTrigger>
                    <TabsTrigger value="tech" className="flex-1 basis-0 text-zinc-400 [&:not([data-active])]:hover:text-sky-400 rounded-lg data-active:bg-sky-400 data-active:text-black">Tech Priorities</TabsTrigger>
                    <TabsTrigger value="primes" className="flex-1 basis-0 text-zinc-400 [&:not([data-active])]:hover:text-sky-400 rounded-lg data-active:bg-sky-400 data-active:text-black">Prime Contractors</TabsTrigger>
                    <TabsTrigger value="leadership" className="flex-1 basis-0 text-zinc-400 [&:not([data-active])]:hover:text-sky-400 rounded-lg data-active:bg-sky-400 data-active:text-black">Leadership</TabsTrigger>
                    <TabsTrigger value="locations" className="flex-1 basis-0 text-zinc-400 [&:not([data-active])]:hover:text-sky-400 rounded-lg data-active:bg-sky-400 data-active:text-black">Locations</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="news" className="mt-0">
                    <div className="prose prose-lg prose-invert max-w-none prose-p:text-zinc-400 prose-li:text-zinc-300 prose-ul:m-0 prose-ul:p-0 prose-li:marker:text-sky-400/70 prose-a:text-sky-400 hover:prose-a:text-sky-300">
                      <div dangerouslySetInnerHTML={{ __html: territory.html }} />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="mission" className="mt-0">
                    <p className="text-zinc-300 leading-relaxed text-lg">{territory.mission || "Mission information not available."}</p>
                  </TabsContent>
                  
                  <TabsContent value="tech" className="mt-0">
                    {territory.tech_priorities && territory.tech_priorities.length > 0 ? (
                      <ul className="space-y-3">
                        {territory.tech_priorities.map((priority, i) => (
                          <li key={i} className="flex items-start gap-3 text-zinc-300">
                            <span className="text-sky-400 mt-1">•</span>
                            <span>{priority}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-zinc-500">No tech priorities listed.</p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="primes" className="mt-0">
                    {territory.prime_contractors && territory.prime_contractors.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {territory.prime_contractors.map((prime, i) => (
                          <span key={i} className="px-3 py-1.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-sm text-zinc-300">
                            {prime}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-zinc-500">No prime contractors listed.</p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="leadership" className="mt-0">
                    {territory.leadership && Object.keys(territory.leadership).length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(territory.leadership).map(([role, nameOrNames], i) => {
                          const renderPerson = (person: string | {name: string; url?: string}, idx?: number) => {
                            if (typeof person === 'string') {
                              return <li key={idx} className="text-zinc-300 font-medium">{person}</li>;
                            }
                            return (
                              <li key={idx} className="font-medium">
                                {person.url ? (
                                  <a href={person.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors w-fit">
                                    {person.name}
                                    <LinkIcon className="w-3 h-3 opacity-70" />
                                  </a>
                                ) : (
                                  <span className="text-zinc-300">{person.name}</span>
                                )}
                              </li>
                            );
                          };

                          return (
                            <div key={i} className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800/50 flex flex-col justify-center">
                              <p className="text-xs font-semibold tracking-wider text-sky-400/80 uppercase mb-1">{role}</p>
                              <ul className="space-y-1">
                                {Array.isArray(nameOrNames) 
                                  ? nameOrNames.map((n, j) => renderPerson(n, j)) 
                                  : renderPerson(nameOrNames)}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-zinc-500">No leadership information available.</p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="locations" className="mt-0">
                    {territory.locations && territory.locations.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {territory.locations.map((loc, i) => (
                          <a 
                            key={i} 
                            href={loc.map_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block p-4 bg-zinc-900/60 rounded-xl border border-zinc-800/50 hover:border-sky-500/50 transition-colors group"
                          >
                            <h4 className="font-semibold text-zinc-200 group-hover:text-sky-400 transition-colors">{loc.name}</h4>
                            <p className="text-sm text-zinc-400 mt-1">{loc.address}</p>
                            <div className="flex items-center gap-1 mt-3 text-xs font-medium text-sky-500">
                              <span>Get Directions</span>
                              <LinkIcon className="h-3 w-3" />
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-zinc-500">No locations listed.</p>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )) : (
              <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-8 animate-pulse space-y-4">
                <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                <div className="h-4 bg-zinc-800 rounded w-full"></div>
                <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
