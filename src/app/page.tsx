"use client";
/* eslint-disable react-hooks/immutability */

import { useEffect, useState, useRef } from "react";
import { flushSync } from "react-dom";
import { toast } from "sonner";
import { Play, Pause, Activity, ShieldAlert, Cpu, Cloud, Car, RefreshCw, Link as LinkIcon, ChevronDown, ChevronRight, HelpCircle, Sun, Moon, Minimize2, Maximize2, EyeOff, GraduationCap } from "lucide-react";
import { Joyride, Step } from "react-joyride";
import { createClient } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AcquisitionForecastItem, getForecastForTerritory, RawApfsRecord } from "@/lib/apfs";
import { SalesQuizModal } from "@/components/SalesQuizModal";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'placeholder';
const supabase = createClient(supabaseUrl, supabaseKey);

interface User {
  id: string;
  name: string;
}

export type SourceTag = "Data Pipeline" | "AI Generated";

export interface DataItem<T> {
  value: T;
  source: SourceTag;
}

interface TerritoryBrief {
  name: string;
  logo: string;
  html?: string;
  news?: DataItem<string>[];
  acquisition_forecast?: DataItem<AcquisitionForecastItem>[];
  mission?: DataItem<string>;
  tech_priorities?: DataItem<string>[];
  prime_contractors?: DataItem<string>[];
  leadership?: Record<string, DataItem<string | { name: string; url?: string }> | DataItem<string | { name: string; url?: string }>[]>;
  locations?: DataItem<{ name: string; address: string; map_url: string }>[];
}

interface BriefData {
  id?: string;
  date: string;
  weather?: string;
  commute?: string;
  territories: TerritoryBrief[];
  podcast_script?: string;
}

function getTerritoryShortName(name: string): string {
  const matches = [...name.matchAll(/\(([^)]+)\)/g)].map((m) => m[1].trim());
  if (matches.length > 0) {
    return matches.join(" & ");
  }
  if (/headquarters/i.test(name)) {
    return "DHS HQ";
  }
  return name;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [briefsMap, setBriefsMap] = useState<Record<string, BriefData>>({});

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPodcastEnded, setIsPodcastEnded] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [musicAudio, setMusicAudio] = useState<HTMLAudioElement | null>(null);
  const [musicVibe, setMusicVibe] = useState<'none' | 'guilty' | 'cliburn' | 'pigs' | 'x-files'>('none');
  const [playbackRate, setPlaybackRate] = useState(1);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshTimeLeft, setRefreshTimeLeft] = useState<number | null>(null);
  const [estimatedCompletionTime, setEstimatedCompletionTime] = useState<string | null>(null);
  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const [showScript, setShowScript] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [networkingEvents, setNetworkingEvents] = useState<any[]>([]);

  const [sourcesData, setSourcesData] = useState<Array<{ name: string; url: string;[key: string]: unknown }>>([]);
  const [isDataSourcesExpanded, setIsDataSourcesExpanded] = useState(false);
  const [expandedForecastIds, setExpandedForecastIds] = useState<Record<string, boolean>>({});
  const [expandedTerritories, setExpandedTerritories] = useState<Record<string, boolean>>({});
  const [pendingDismissItem, setPendingDismissItem] = useState<AcquisitionForecastItem | null>(null);
  const [isDismissing, setIsDismissing] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const [isLightMode, setIsLightMode] = useState(true);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizSessionKey, setQuizSessionKey] = useState(0);

  const confirmDismissForecastItem = async () => {
    if (!pendingDismissItem || isDismissing) return;
    const itemToDismiss = pendingDismissItem;
    setIsDismissing(true);

    // 1. Optimistically remove the record from all territory forecast lists in UI
    setBriefsMap((prev) => {
      const updated: Record<string, BriefData> = {};
      for (const [uid, brief] of Object.entries(prev)) {
        updated[uid] = {
          ...brief,
          territories: brief.territories.map((t) => ({
            ...t,
            acquisition_forecast: t.acquisition_forecast
              ? t.acquisition_forecast.filter((f) => f.value.id !== itemToDismiss.id)
              : [],
          })),
        };
      }
      return updated;
    });
    setPendingDismissItem(null);

    try {
      // 2. Persist to database in oracle_articles so future loads and pipeline runs exclude it
      const { error } = await supabase.from('oracle_articles').upsert({
        id: `dismissed_apfs_${itemToDismiss.id}`,
        source_id: 'source-afps',
        url: itemToDismiss.url,
        title: `[DISMISSED] ${itemToDismiss.requirements_title}`,
        content: 'DISMISSED_BY_USER',
        published_at: '1970-01-01T00:00:00.000Z',
        ingested_at: new Date().toISOString(),
      });

      if (error) {
        console.error('Failed to mark APFS record in database:', error);
        toast.error('Removed from view, but failed to persist to database.');
      } else {
        toast.success('Record marked as Not Interested and hidden from future loads.');
      }
    } catch (err) {
      console.error('Error persisting dismissed APFS record:', err);
      toast.error('Error saving preference to database.');
    } finally {
      setIsDismissing(false);
    }
  };

  const toggleTerritoryCard = (territoryName: string) => {
    const update = () => {
      setExpandedTerritories((prev) => ({
        ...prev,
        [territoryName]: !prev[territoryName],
      }));
    };
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      (document as Document & { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
        flushSync(update);
      });
    } else {
      update();
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('oracle_theme');
    if (savedTheme === 'dark') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLightMode(false);
      document.documentElement.classList.remove('light');
    } else {
      setIsLightMode(true);
      document.documentElement.classList.add('light');
    }
  }, []);

  const toggleTheme = () => {
    setIsLightMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('light', next);
      localStorage.setItem('oracle_theme', next ? 'light' : 'dark');
      return next;
    });
  };

  const tourSteps: Step[] = [
    {
      target: '.tour-user-tabs',
      content: 'Welcome to your Daily Brief! Select your name here to view your personalized dashboard.',
      skipBeacon: true,
    },
    {
      target: '.tour-podcast',
      content: 'Listen to an AI-generated morning podcast summarizing your territories and the latest news.',
    },
    {
      target: '.tour-territory-card',
      content: 'Each of your territories has its own card with tabs for the latest news, mission, tech priorities, and more.',
    },
    {
      target: '.tour-networking',
      content: 'Stay on top of upcoming federal and industry networking events, or click View All to browse the full calendar.',
    },
    {
      target: '.tour-local-conditions',
      content: 'Check the local weather and commute conditions for your area.',
    },
    {
      target: '.tour-data-sources',
      content: 'View the underlying news sources and articles that powered today\'s insights.',
    }
  ];

  const data = selectedUser ? briefsMap[selectedUser] : null;

  const allTerritoriesExpanded = Boolean(
    data?.territories?.length &&
    data.territories.every((t) => expandedTerritories[t.name])
  );

  const toggleAllTerritoryCards = () => {
    if (!data?.territories?.length) return;
    const update = () => {
      if (allTerritoriesExpanded) {
        setExpandedTerritories({});
      } else {
        const next: Record<string, boolean> = {};
        for (const t of data.territories) {
          next[t.name] = true;
        }
        setExpandedTerritories(next);
      }
    };
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      (document as Document & { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
        flushSync(update);
      });
    } else {
      update();
    }
  };

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
        if (userData.length > 0) setSelectedUser(userData.find(u => u.name === 'Dan Ungerleider')?.id || userData[0].id);
      }

      // Fetch dismissed APFS record IDs from database
      const dismissedApfsIds = new Set<number>();
      try {
        const { data: dismissedRows } = await supabase
          .from('oracle_articles')
          .select('id')
          .like('id', 'dismissed_apfs_%');
        for (const row of dismissedRows || []) {
          const num = Number(String(row.id).replace('dismissed_apfs_', ''));
          if (!isNaN(num)) dismissedApfsIds.add(num);
        }
      } catch (err) {
        console.warn("Could not load dismissed APFS records", err);
      }

      // Fetch APFS forecast data (fallback to static cached JSON in public/data)
      let apfsRecords: RawApfsRecord[] = [];
      try {
        const apfsRes = await fetch('/data/apfs_forecast.json');
        if (apfsRes.ok) {
          const rawApfs: RawApfsRecord[] = await apfsRes.json();
          apfsRecords = rawApfs.filter((r) => !dismissedApfsIds.has(r.id));
        }
      } catch (err) {
        console.warn("Could not load cached APFS forecast JSON", err);
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
            // Normalize data to support item-level source badges
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            b.territories = b.territories.map((t: any) => {
              const wrap = <T,>(val: T | DataItem<T>): DataItem<T> =>
                (val && typeof val === 'object' && 'source' in val && 'value' in val) ? val as DataItem<T> : { value: val as T, source: "Data Pipeline" };

              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const wrapArray = <T,>(arr: any[] | undefined): DataItem<T>[] =>
                arr ? arr.map(wrap) : [];

              const news: DataItem<string>[] = t.news ? wrapArray(t.news) : [];
              if (news.length === 0 && t.html) {
                const liRegex = /<li>(.*?)<\/li>/g;
                let match;
                while ((match = liRegex.exec(t.html)) !== null) {
                  const item = match[1].trim();
                  if (item && item !== "No significant activity to report this week.") {
                    news.push({ value: item, source: "Data Pipeline" });
                  }
                }
              }

              news.sort((a, b) => {
                const extractDate = (val: string) => {
                  const match = val.match(/<strong>(.*?)<\/strong>/);
                  return match ? new Date(match[1]).getTime() : 0;
                };
                return extractDate(b.value) - extractDate(a.value);
              });

              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const leadership: any = {};
              if (t.leadership) {
                for (const [key, val] of Object.entries(t.leadership)) {
                  if (Array.isArray(val)) {
                    leadership[key] = val.map(wrap);
                  } else {
                    leadership[key] = wrap(val);
                  }
                }
              }

              const rawForecastItems =
                t.acquisition_forecast && t.acquisition_forecast.length > 0
                  ? wrapArray<AcquisitionForecastItem>(t.acquisition_forecast)
                  : wrapArray<AcquisitionForecastItem>(getForecastForTerritory(apfsRecords, t.name));

              const forecastItems = rawForecastItems.filter(
                (item) => !dismissedApfsIds.has(item.value.id)
              );

              return {
                ...t,
                news,
                acquisition_forecast: forecastItems,
                mission: t.mission ? wrap(t.mission) : undefined,
                tech_priorities: wrapArray(t.tech_priorities),
                prime_contractors: wrapArray(t.prime_contractors),
                leadership,
                locations: wrapArray(t.locations)
              };
            });
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

      // Fetch networking events
      const { data: events, error: eventsError } = await supabase
        .from('oracle_networking_events')
        .select('*')
        .order('event_date', { ascending: true });
        
      if (eventsError) {
        console.error("Could not load networking events", eventsError);
      } else {
        setNetworkingEvents(events);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    // In dev, sometimes the file might not exist yet, we catch errors gracefully by adding listeners
    const cacheBuster = data?.date ? `?v=${new Date(data.date).getTime()}` : '';
    const podcastAudio = new Audio(`${supabaseUrl}/storage/v1/object/public/recordings/podcast_${selectedUser}.mp3${cacheBuster}`);

    const handleLoadedMetadata = () => setDuration(podcastAudio.duration);
    const handleTimeUpdate = () => setCurrentTime(podcastAudio.currentTime);
    const handleEnded = () => {
      setIsPodcastEnded(true);
      setIsPlaying(false);
      setCurrentTime(0);
    };

    podcastAudio.addEventListener("loadedmetadata", handleLoadedMetadata);
    podcastAudio.addEventListener("timeupdate", handleTimeUpdate);
    podcastAudio.addEventListener("ended", handleEnded);

    // eslint-disable-next-line react-hooks/set-state-in-effect
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
  }, [selectedUser, data?.date]);

  useEffect(() => {
    if (musicVibe === 'none') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMusicAudio(null);
      return;
    }
    const bgMusic = new Audio(`/data/${musicVibe}.mp3`);
    bgMusic.loop = true;
    bgMusic.volume = 0.08;
    setMusicAudio(bgMusic);

    return () => {
      bgMusic.pause();
      bgMusic.src = '';
    };
  }, [musicVibe]);

  useEffect(() => {
    if (!musicAudio) return;

    if (isPlaying) {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      musicAudio.volume = 0.08;
      musicAudio.playbackRate = playbackRate;
      musicAudio.play().catch(e => console.error("Autoplay prevented:", e));
    } else {
      if (isPodcastEnded) {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        let vol = 0.08;
        const fadeStep = 0.08 / 100; // 10 seconds = 100 * 100ms

        fadeIntervalRef.current = setInterval(() => {
          vol -= fadeStep;
          if (vol <= 0.005) {
            musicAudio.pause();
            musicAudio.volume = 0.08;
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
          } else {
            musicAudio.volume = vol;
          }
        }, 100);
      } else {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        musicAudio.pause();
        musicAudio.volume = 0.08;
      }
    }
  }, [musicAudio, isPlaying, playbackRate, isPodcastEnded]);

  useEffect(() => {
    if (refreshTimeLeft === null) return;

    if (refreshTimeLeft <= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
      setIsPodcastEnded(false);
      audio.playbackRate = playbackRate; // ensure speed is respected
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackRate(nextSpeed);
    if (audio) {
      audio.playbackRate = nextSpeed;
    }
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
    setShowRefreshModal(false);
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
        toast.success("Data pipeline triggered! The site will update in ~2.25 minutes.");
        setRefreshTimeLeft(135);
        setEstimatedCompletionTime(new Date(Date.now() + 135 * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
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


  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-rose-500/30">
      <div className="fixed top-[-50%] left-[-20%] w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-950 to-zinc-950 -z-10 blur-3xl pointer-events-none" />

      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous={true}
        locale={{ last: 'Close' }}
        options={{ primaryColor: '#0ea5e9' }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onEvent={(data: any) => {
          const { status, action } = data;
          if (status === 'finished' || status === 'skipped' || action === 'close') {
            setRunTour(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        styles={{
          beaconInner: { backgroundColor: '#0ea5e9' },
          beaconOuter: { borderColor: '#0ea5e9' },
          tooltip: {
            backgroundColor: isLightMode ? '#ffffff' : '#18181b',
            color: isLightMode ? '#1e293b' : '#d4d4d8',
            textAlign: 'left',
          },
          buttonPrimary: {
            backgroundColor: '#0ea5e9',
            color: '#ffffff',
            fontWeight: 'bold',
          },
          buttonBack: {
            color: isLightMode ? '#64748b' : '#a1a1aa',
          },
        }}
      />
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
            <span className="text-xs text-zinc-500 font-medium tracking-wide">{lastUpdated}</span>
            {refreshTimeLeft !== null ? (
              <div className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg p-3 shadow-xl backdrop-blur-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold tracking-wide text-sky-400 uppercase animate-pulse">Running Pipeline...</span>
                  <span className="text-xs text-zinc-400 font-medium">
                    {Math.floor(refreshTimeLeft / 60)}:{(refreshTimeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${((135 - refreshTimeLeft) / 135) * 100}%` }}
                  />
                </div>
                {estimatedCompletionTime && (
                  <div className="text-[10px] text-zinc-500 text-right font-medium">
                    Est. completion: {estimatedCompletionTime}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setQuizSessionKey((k) => k + 1);
                    setShowQuizModal(true);
                  }}
                  className="flex items-center gap-2 px-3.5 py-2.5 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 rounded-lg text-sky-400 text-xs font-semibold transition-colors shadow-xl backdrop-blur-md cursor-pointer"
                  title="Launch Quiz"
                >
                  <GraduationCap className="h-4 w-4" />
                  <span>Launch Quiz</span>
                </button>
                <button
                  onClick={() => setRunTour(true)}
                  className="flex items-center justify-center p-2.5 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-300 transition-colors shadow-xl backdrop-blur-md"
                  title="App Walkthrough"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-center p-2.5 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-300 transition-colors shadow-xl backdrop-blur-md"
                  title={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
                  aria-label={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
                >
                  {isLightMode ? <Moon className="h-4 w-4 text-sky-400" /> : <Sun className="h-4 w-4 text-amber-400" />}
                </button>
                <button
                  onClick={() => setShowRefreshModal(true)}
                  disabled={isRefreshing}
                  className="hidden tour-refresh-feed items-center justify-center p-2.5 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xl backdrop-blur-md"
                  title="Refresh Feed"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Salesperson Quiz Modal */}
        <SalesQuizModal
          key={quizSessionKey}
          isOpen={showQuizModal}
          onClose={() => setShowQuizModal(false)}
          isLightMode={isLightMode}
        />

        {/* Refresh Confirmation Modal */}
        {showRefreshModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-xl font-bold text-zinc-100 mb-2">Confirm Pipeline Refresh</h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Your daily brief is automatically refreshed at 6:00 AM ET every day.
                Manually rerunning the data pipeline will incur a cost of approximately <strong className="text-sky-400 font-semibold">$0.05</strong>.
                Are you sure you want to proceed?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowRefreshModal(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={triggerRefresh}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-sky-500 hover:bg-sky-400 text-zinc-950 transition-colors"
                >
                  Confirm Refresh
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Not Interested Confirmation Modal */}
        {pendingDismissItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-xl font-bold text-zinc-100 mb-2">Mark as Not Interested?</h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-3">
                Are you sure you want to hide this acquisition forecast record? It will be removed from your view and marked in the database so it will not appear again in future loads:
              </p>
              <div className="p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/60 mb-6">
                <p className="text-sm font-semibold text-zinc-100">{pendingDismissItem.requirements_title}</p>
                <p className="text-xs text-sky-400 mt-1">
                  APFS Record: {pendingDismissItem.apfs_number} &bull; Est. Release: {pendingDismissItem.estimated_solicitation_release_date}
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPendingDismissItem(null)}
                  disabled={isDismissing}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDismissForecastItem}
                  disabled={isDismissing}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-rose-500 hover:bg-rose-600 text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isDismissing ? 'Removing...' : 'Confirm Not Interested'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Tabs */}
        {users.length > 0 && (
          <Tabs
            value={selectedUser || undefined}
            onValueChange={(val) => {
              setSelectedUser(val);
              setExpandedTerritories({});
            }}
            className="tour-user-tabs w-full mb-12"
          >
            <TabsList className="flex w-full h-auto group-data-horizontal/tabs:h-auto bg-zinc-900/60 border border-zinc-700/50 p-2 rounded-3xl gap-2 shadow-lg backdrop-blur-sm">
              {users.map(u => (
                <TabsTrigger
                  key={u.id}
                  value={u.id}
                  className={`flex-1 py-[7.5px] border-0 bg-transparent shadow-none text-zinc-400 text-lg [&:not([data-active])]:hover:bg-zinc-800/80 [&:not([data-active])]:hover:text-sky-400 rounded-2xl data-active:bg-sky-500 data-active:shadow-sm ${isLightMode ? 'data-active:text-white' : 'data-active:text-zinc-950'} font-bold transition-all`}
                >
                  {u.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        <div className="flex flex-col md:grid md:grid-cols-3 gap-6">

          <div className="contents md:flex md:flex-col md:gap-6">
            <div className="tour-podcast order-1 md:order-none w-full bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-6 flex flex-col gap-5 hover:border-zinc-700 transition-colors shadow-2xl">
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
                <button
                  onClick={cycleSpeed}
                  className="ml-2 px-3 py-1.5 bg-zinc-800/50 hover:bg-zinc-700/50 text-xs font-semibold text-zinc-300 rounded-md transition-colors"
                >
                  {playbackRate}x
                </button>
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

              <div className="flex flex-nowrap gap-1.5 w-full mt-2 justify-center overflow-x-auto pb-1 scrollbar-hide">
                <button
                  onClick={() => setMusicVibe('none')}
                  className={`text-[9px] font-semibold px-2 py-1.5 rounded-full transition-all flex-1 whitespace-nowrap ${musicVibe === 'none' ? 'bg-zinc-500/20 text-zinc-300 border border-zinc-500/50' : 'bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 border border-transparent'}`}
                >
                  None
                </button>
                <button
                  onClick={() => setMusicVibe('guilty')}
                  className={`text-[9px] font-semibold px-2 py-1.5 rounded-full transition-all flex-1 whitespace-nowrap ${musicVibe === 'guilty' ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/50' : 'bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 border border-transparent'}`}
                >
                  Music 1
                </button>
                <button
                  onClick={() => setMusicVibe('cliburn')}
                  className={`text-[9px] font-semibold px-2 py-1.5 rounded-full transition-all flex-1 whitespace-nowrap ${musicVibe === 'cliburn' ? 'bg-teal-500/20 text-teal-400 border border-teal-500/50' : 'bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 border border-transparent'}`}
                >
                  Music 2
                </button>
                <button
                  onClick={() => setMusicVibe('pigs')}
                  className={`text-[9px] font-semibold px-2 py-1.5 rounded-full transition-all flex-1 whitespace-nowrap ${musicVibe === 'pigs' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50' : 'bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 border border-transparent'}`}
                >
                  Music 3
                </button>
                <button
                  onClick={() => setMusicVibe('x-files')}
                  className={`text-[9px] font-semibold px-2 py-1.5 rounded-full transition-all flex-1 whitespace-nowrap ${musicVibe === 'x-files' ? 'bg-lime-500/20 text-lime-400 border border-lime-500/50' : 'bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 border border-transparent'}`}
                >
                  Music 4
                </button>
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


            <div className="tour-networking order-2 md:order-none bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-zinc-400 uppercase tracking-wider">Networking</h3>
                <a href="/networking" className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors">View All &rarr;</a>
              </div>
              
              <ul className="space-y-4">
                {networkingEvents.length > 0 ? networkingEvents.slice(0, 3).map((ev, i) => (
                  <li key={i} className="flex flex-col gap-1">
                    <p className="font-medium text-sm text-zinc-200 line-clamp-1" title={ev.name}>{ev.name}</p>
                    <p className="text-xs text-zinc-500">
                      {ev.event_date ? new Date(ev.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD'} &bull; {ev.venue || 'Virtual'}
                    </p>
                  </li>
                )) : (
                  <li className="text-sm text-zinc-500">No upcoming events.</li>
                )}
              </ul>
            </div>

            <div className="tour-local-conditions order-3 md:order-none bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-6">
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

            <div className="tour-data-sources order-5 md:order-none bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-6">
              <button
                onClick={() => setIsDataSourcesExpanded(!isDataSourcesExpanded)}
                className="w-full flex items-center justify-between text-left group"
              >
                <h3 className={`text-base font-semibold uppercase tracking-wider transition-colors ${isDataSourcesExpanded ? 'text-zinc-300' : 'text-zinc-400 group-hover:text-sky-400'}`}>Data Sources</h3>
                {isDataSourcesExpanded ? (
                  <ChevronDown className="h-4 w-4 text-zinc-400 group-hover:text-sky-400 transition-colors" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-sky-400 transition-colors" />
                )}
              </button>
              {isDataSourcesExpanded && (
                <ul className="space-y-3 mt-4">
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
              )}
            </div>
          </div>

          <div className="order-2 md:order-none md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start content-start">
            {data?.territories && data.territories.length > 0 && (
              <div className="col-span-full flex items-center justify-end -mb-2">
                <button
                  type="button"
                  onClick={toggleAllTerritoryCards}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-sky-400 border border-zinc-800/80 hover:border-sky-400/50 transition-all shadow-sm backdrop-blur-md cursor-pointer"
                >
                  {allTerritoriesExpanded ? (
                    <>
                      <Minimize2 className="h-3.5 w-3.5 text-sky-400" />
                      <span>All</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-3.5 w-3.5 text-sky-400" />
                      <span>All</span>
                    </>
                  )}
                </button>
              </div>
            )}
            {data?.territories ? data.territories.map((territory, idx) => {
              const isTerritoryExpanded = !!expandedTerritories[territory.name];
              const shortName = getTerritoryShortName(territory.name);

              if (!isTerritoryExpanded) {
                return (
                  <button
                    key={territory.name || idx}
                    type="button"
                    onClick={() => toggleTerritoryCard(territory.name)}
                    style={{ viewTransitionName: `territory-card-${idx}` }}
                    className={`${idx === 0 ? 'tour-territory-card' : ''} group relative flex flex-col items-center justify-center gap-4 bg-zinc-900/40 hover:bg-zinc-900/70 backdrop-blur-md border border-zinc-800/50 hover:border-sky-400/60 rounded-2xl p-8 aspect-square w-full text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-xl cursor-pointer animate-in fade-in zoom-in-95`}
                  >
                    <Maximize2 className="h-4 w-4 text-zinc-400 opacity-0 group-hover:opacity-100 group-hover:text-sky-400 transition-all absolute top-4 right-4" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={territory.logo}
                      alt={territory.name}
                      className="w-20 h-20 object-contain opacity-95 group-hover:scale-110 transition-transform duration-300"
                    />
                    <h3 className="text-xl font-bold tracking-tight text-sky-400 group-hover:text-sky-300 transition-colors">
                      {shortName}
                    </h3>
                  </button>
                );
              }

              return (
              <div
                key={territory.name || idx}
                style={{ viewTransitionName: `territory-card-${idx}` }}
                className={`${idx === 0 ? 'tour-territory-card' : ''} col-span-1 sm:col-span-2 lg:col-span-3 bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-8 transition-all duration-300 animate-in fade-in zoom-in-95`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={territory.logo} alt={territory.name} className="w-8 h-8 opacity-90" />
                    <h3 className="text-2xl font-semibold text-sky-400">{territory.name}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleTerritoryCard(territory.name)}
                    className="inline-flex items-center justify-center p-2 rounded-lg text-xs font-semibold bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 hover:text-sky-400 border border-zinc-700/60 transition-colors self-start sm:self-auto cursor-pointer shrink-0"
                    title="Shrink back to grid"
                    aria-label="Shrink back to grid"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </button>
                </div>

                <Tabs defaultValue="news" className="w-full">
                  <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:flex w-full h-auto group-data-horizontal/tabs:h-auto bg-zinc-950/50 border border-zinc-800/50 mb-6 p-1 rounded-xl gap-1">
                    <TabsTrigger value="news" className={`flex-1 px-2.5 py-2 text-xs text-zinc-400 [&:not([data-active])]:hover:text-sky-400 rounded-lg data-active:bg-sky-400 ${isLightMode ? 'data-active:text-white' : 'data-active:text-black'}`}>Latest News</TabsTrigger>
                    <TabsTrigger value="acquisition-forecast" className={`flex-1 px-2 py-2 text-xs text-zinc-400 [&:not([data-active])]:hover:text-sky-400 rounded-lg data-active:bg-sky-400 ${isLightMode ? 'data-active:text-white' : 'data-active:text-black'}`}>Acquisition Forecast</TabsTrigger>
                    <TabsTrigger value="mission-tech" className={`flex-1 px-2.5 py-2 text-xs text-zinc-400 [&:not([data-active])]:hover:text-sky-400 rounded-lg data-active:bg-sky-400 ${isLightMode ? 'data-active:text-white' : 'data-active:text-black'}`}>Mission & Tech</TabsTrigger>
                    <TabsTrigger value="primes" className={`flex-1 px-2.5 py-2 text-xs text-zinc-400 [&:not([data-active])]:hover:text-sky-400 rounded-lg data-active:bg-sky-400 ${isLightMode ? 'data-active:text-white' : 'data-active:text-black'}`}>Primes</TabsTrigger>
                    <TabsTrigger value="leadership" className={`flex-1 px-2.5 py-2 text-xs text-zinc-400 [&:not([data-active])]:hover:text-sky-400 rounded-lg data-active:bg-sky-400 ${isLightMode ? 'data-active:text-white' : 'data-active:text-black'}`}>Leadership</TabsTrigger>
                    <TabsTrigger value="locations" className={`flex-1 px-2.5 py-2 text-xs text-zinc-400 [&:not([data-active])]:hover:text-sky-400 rounded-lg data-active:bg-sky-400 ${isLightMode ? 'data-active:text-white' : 'data-active:text-black'}`}>Locations</TabsTrigger>
                  </TabsList>

                  <TabsContent value="news" className="mt-0">
                    <div
                      className={`prose prose-base ${isLightMode ? '' : 'prose-invert'} max-w-none prose-p:text-zinc-400 prose-a:text-sky-400 hover:prose-a:text-sky-300 space-y-3`}
                      onClick={(e) => {
                        const target = e.target as HTMLElement;
                        const anchor = target.closest('a');
                        if (anchor && anchor.href) {
                          e.preventDefault();
                          window.open(anchor.href, '_blank', 'noopener,noreferrer');
                        }
                      }}
                    >
                      {territory.news && territory.news.length > 0 ? (
                        territory.news.map((item, i) => {
                          const isEven = i % 2 === 0;
                          return (
                            <div
                              key={i}
                              className={`rounded-xl p-4 border transition-colors text-zinc-200 leading-relaxed ${
                                isLightMode
                                  ? isEven
                                    ? 'bg-[#ffffff] border-[#cbd5e1] hover:border-sky-500/70 shadow-xs'
                                    : 'bg-[#e2e8f0] border-[#94a3b8] hover:border-sky-500/70'
                                  : isEven
                                    ? 'bg-[#09090b] border-[#27272a] hover:border-sky-500/50'
                                    : 'bg-[#27272a] border-[#52525b] hover:border-sky-500/50'
                              }`}
                            >
                              <span dangerouslySetInnerHTML={{ __html: item.value }} />
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-zinc-500">No significant activity to report this week.</p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="acquisition-forecast" className="mt-0">
                    {territory.acquisition_forecast && territory.acquisition_forecast.length > 0 ? (
                      <div className="space-y-3 max-h-[540px] overflow-y-auto pr-2">
                        {territory.acquisition_forecast.map((item, i) => {
                          const acq = item.value;
                          const itemKey = `${territory.name}-${acq.id || acq.apfs_number || i}`;
                          const isExpanded = !!expandedForecastIds[itemKey];
                          const isEven = i % 2 === 0;
                          const toggleExpand = () =>
                            setExpandedForecastIds((prev) => ({
                              ...prev,
                              [itemKey]: !prev[itemKey],
                            }));

                          return (
                            <div
                              key={itemKey}
                              className={`rounded-xl p-4 border transition-colors ${
                                isLightMode
                                  ? isEven
                                    ? 'bg-[#ffffff] border-[#cbd5e1] hover:border-sky-500/70 shadow-xs'
                                    : 'bg-[#e2e8f0] border-[#94a3b8] hover:border-sky-500/70'
                                  : isEven
                                    ? 'bg-[#09090b] border-[#27272a] hover:border-sky-500/50'
                                    : 'bg-[#27272a] border-[#52525b] hover:border-sky-500/50'
                              }`}
                            >
                              <div className="flex flex-col gap-2.5">
                                <div
                                  role="button"
                                  tabIndex={0}
                                  aria-expanded={isExpanded}
                                  onClick={toggleExpand}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      toggleExpand();
                                    }
                                  }}
                                  className="flex flex-col gap-2.5 cursor-pointer group select-none"
                                >
                                  <div className="flex flex-wrap items-start justify-between gap-2">
                                    <div className="font-semibold text-base text-zinc-100 group-hover:text-sky-400 transition-colors flex items-start gap-2 flex-1">
                                      {isExpanded ? (
                                        <ChevronDown className="h-4 w-4 mt-1 shrink-0 text-sky-400 transition-transform" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4 mt-1 shrink-0 text-zinc-400 group-hover:text-sky-400 transition-transform" />
                                      )}
                                      <span>{acq.requirements_title}</span>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                      <a
                                        href={acq.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="inline-flex items-center gap-1 text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors"
                                      >
                                        <span>APFS Record ({acq.apfs_number})</span>
                                        <LinkIcon className="h-3 w-3" />
                                      </a>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setPendingDismissItem(acq);
                                        }}
                                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 transition-colors cursor-pointer"
                                        title="Mark as Not Interested"
                                      >
                                        <EyeOff className="h-3 w-3" />
                                        <span>Not Interested</span>
                                      </button>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-2 text-xs pl-6">
                                    <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-medium">
                                      Est. Solicitation Release: {acq.estimated_solicitation_release_date}
                                    </span>
                                    <span className="px-2 py-0.5 rounded bg-zinc-900/90 text-zinc-300 border border-zinc-700/60 font-medium">
                                      Dollar Range: {acq.dollar_range}
                                    </span>
                                    <span className="px-2 py-0.5 rounded bg-zinc-900/90 text-zinc-300 border border-zinc-700/60 font-medium">
                                      Contract Type: {acq.contract_type}
                                    </span>
                                  </div>
                                </div>

                                {isExpanded && (
                                  <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line pl-6 pt-2 border-t border-zinc-800/60">
                                    {acq.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-zinc-500">No upcoming acquisitions forecasted within the next 3 years.</p>
                    )}
                  </TabsContent>

                  <TabsContent value="mission-tech" className="mt-0 space-y-8">
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Mission</h4>
                      <p className="text-zinc-300 leading-relaxed text-lg">
                        {territory.mission ? territory.mission.value : "Mission information not available."}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Tech Priorities</h4>
                      {territory.tech_priorities && territory.tech_priorities.length > 0 ? (
                        <ul className="space-y-3">
                          {territory.tech_priorities.map((priority, i) => (
                            <li key={i} className="flex items-start gap-3 text-zinc-300">
                              <span className="text-sky-400 mt-1">•</span>
                              <span className="flex-1">
                                {priority.value}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-zinc-500">No tech priorities listed.</p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="primes" className="mt-0">
                    {territory.prime_contractors && territory.prime_contractors.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {territory.prime_contractors.map((prime, i) => (
                          <span key={i} className="px-3 py-1.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-sm text-zinc-300 flex items-center gap-2">
                            {prime.value}
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
                          const renderPerson = (person: DataItem<string | { name: string; url?: string }>, idx?: number) => {
                            const val = person.value;
                            const isString = typeof val === 'string';
                            return (
                              <li key={idx} className="font-medium flex items-center gap-2">
                                {isString ? (
                                  <span className="text-zinc-300">{val}</span>
                                ) : (
                                  val.url ? (
                                    <a href={val.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors w-fit">
                                      {val.name}
                                      <LinkIcon className="w-3 h-3 opacity-70" />
                                    </a>
                                  ) : (
                                    <span className="text-zinc-300">{val.name}</span>
                                  )
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
                          <div key={i} className="relative block p-4 bg-zinc-900/60 rounded-xl border border-zinc-800/50 hover:border-sky-500/50 transition-colors group">
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold text-zinc-200 group-hover:text-sky-400 transition-colors">{loc.value.name}</h4>
                            </div>
                            <p className="text-sm text-zinc-400 mt-1">{loc.value.address}</p>
                            <a href={loc.value.map_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 mt-3 text-xs font-medium text-sky-500 w-fit">
                              <span>Get Directions</span>
                              <LinkIcon className="h-3 w-3" />
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-zinc-500">No locations listed.</p>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
              );
            }) : (
              <div className="col-span-full bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-8 animate-pulse space-y-4">
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
