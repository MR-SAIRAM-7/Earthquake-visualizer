import { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import MapVisualizer from "./components/MapVisualizer.jsx";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Loader from "./components/Loader.jsx";
import StatsPanel from "./components/StatsPanel.jsx";
import { formatEpoch } from "./utils/format.js";

/**
 * Modern Earthquake Visualizer App with enhanced UX and contemporary design
 */
const DATA_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

export default function App() {
  const [quakes, setQuakes] = useState([]);
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");
  const [lastFetchTime, setLastFetchTime] = useState(null);

  // Filters with enhanced state management
  const [minMag, setMinMag] = useState(0);
  const [maxMag, setMaxMag] = useState(10);
  const [regionQuery, setRegionQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("all"); // 'all', '1h', '6h', '12h', '24h'
  const [selectedQuake, setSelectedQuake] = useState(null);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showStats, setShowStats] = useState(false);

  // Enhanced fetch function with better error handling
  const fetchQuakes = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    
    try {
      const { data } = await axios.get(DATA_URL, {
        timeout: 15000,
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!data || !Array.isArray(data.features)) {
        throw new Error("Invalid response format from USGS API");
      }

      // Enhanced data processing with validation
      const parsed = data.features
        .map((f) => {
          const id = f.id || crypto.randomUUID();
          const props = f.properties || {};
          const geom = f.geometry || {};
          const coords = geom.coordinates || [];
          const mag = typeof props.mag === "number" ? props.mag : null;

          // Enhanced validation
          if (!coords || coords.length < 2 || mag === null || isNaN(coords[0]) || isNaN(coords[1])) {
            return null;
          }

          return {
            id,
            mag: Math.round(mag * 10) / 10, // Round to 1 decimal
            place: props.place || "Unknown location",
            time: typeof props.time === "number" ? props.time : null,
            url: props.url || null,
            lon: coords[0],
            lat: coords[1],
            depth: typeof coords[2] === "number" ? Math.round(coords[2] * 10) / 10 : null,
            significance: props.sig || 0,
            felt: props.felt || null,
            cdi: props.cdi || null,
            mmi: props.mmi || null,
            status: props.status || "automatic",
            tsunami: props.tsunami || 0,
            type: props.type || "earthquake"
          };
        })
        .filter(Boolean)
        .sort((a, b) => (b.time || 0) - (a.time || 0)); // Sort by most recent

      setQuakes(parsed);
      setStatus("success");
      setLastFetchTime(Date.now());
    } catch (err) {
      setStatus("error");
      if (err.code === 'ECONNABORTED') {
        setErrorMessage("Request timed out. The earthquake service may be busy. Please try again.");
      } else if (err.response?.status === 404) {
        setErrorMessage("Earthquake data service is temporarily unavailable.");
      } else if (!navigator.onLine) {
        setErrorMessage("No internet connection. Please check your network and try again.");
      } else {
        setErrorMessage("Failed to load earthquake data. Please try again in a moment.");
      }
    }
  }, []);

  useEffect(() => {
    fetchQuakes();
    
    // Auto-refresh every 5 minutes for live data
    const interval = setInterval(fetchQuakes, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchQuakes]);

  // Enhanced filtering with time-based filters
  const filteredQuakes = useMemo(() => {
    const q = (regionQuery || "").trim().toLowerCase();
    const now = Date.now();
    
    return quakes.filter((e) => {
      // Magnitude filter
      const passesMag = e.mag >= minMag && e.mag <= maxMag;
      
      // Region filter
      const passesRegion = q === "" || (e.place || "").toLowerCase().includes(q);
      
      // Time filter
      let passesTime = true;
      if (timeFilter !== "all" && e.time) {
        const hours = parseInt(timeFilter.replace('h', ''));
        const cutoff = now - (hours * 60 * 60 * 1000);
        passesTime = e.time >= cutoff;
      }
      
      return passesMag && passesRegion && passesTime;
    });
  }, [quakes, minMag, maxMag, regionQuery, timeFilter]);

  // Statistics for the stats panel
  const stats = useMemo(() => {
    if (!filteredQuakes.length) return null;
    
    const magnitudes = filteredQuakes.map(q => q.mag);
    const depths = filteredQuakes.filter(q => q.depth !== null).map(q => q.depth);
    
    return {
      total: filteredQuakes.length,
      avgMag: magnitudes.reduce((sum, mag) => sum + mag, 0) / magnitudes.length,
      maxMag: Math.max(...magnitudes),
      minMag: Math.min(...magnitudes),
      avgDepth: depths.length ? depths.reduce((sum, d) => sum + d, 0) / depths.length : null,
      withTsunami: filteredQuakes.filter(q => q.tsunami === 1).length,
      significant: filteredQuakes.filter(q => q.significance > 600).length
    };
  }, [filteredQuakes]);

  const lastUpdated = useMemo(() => {
    if (!quakes.length) return null;
    const mostRecent = Math.max(...quakes.map((q) => q.time || 0));
    return mostRecent ? formatEpoch(mostRecent) : null;
  }, [quakes]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header 
        onRefresh={fetchQuakes} 
        lastUpdated={lastUpdated}
        isLoading={status === "loading"}
        onToggleStats={() => setShowStats(!showStats)}
        showStats={showStats}
      />

      <div className="flex flex-1 min-h-0 relative">
        {/* Sidebar */}
        <Sidebar
          minMag={minMag}
          maxMag={maxMag}
          onMinMagChange={setMinMag}
          onMaxMagChange={setMaxMag}
          regionQuery={regionQuery}
          onRegionQueryChange={setRegionQuery}
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
          count={filteredQuakes.length}
          total={quakes.length}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          selectedQuake={selectedQuake}
          onQuakeSelect={setSelectedQuake}
          quakes={filteredQuakes.slice(0, 50)} // Show recent 50 in sidebar
        />

        {/* Main Content */}
        <main className="flex-1 relative overflow-hidden">
          {/* Loading overlay with modern spinner */}
          {status === "loading" && (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/80 backdrop-blur-sm">
              <Loader />
            </div>
          )}

          {/* Error state with modern design */}
          {status === "error" && (
            <div className="absolute inset-0 flex items-center justify-center p-6 z-20">
              <div className="max-w-md w-full bg-white/95 backdrop-blur shadow-2xl rounded-3xl p-8 text-center border border-red-100">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-800 mb-2">
                  Connection Error
                </h2>
                <p className="text-slate-600 mb-6">{errorMessage}</p>
                <button
                  onClick={fetchQuakes}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 text-white hover:from-slate-800 hover:to-slate-600 transition-all duration-200 transform hover:scale-105 font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* No data state */}
          {status === "success" && filteredQuakes.length === 0 && quakes.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center p-6 z-20">
              <div className="max-w-md w-full bg-white/95 backdrop-blur shadow-2xl rounded-3xl p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-800 mb-2">
                  No Earthquakes Found
                </h2>
                <p className="text-slate-600 mb-4">
                  No earthquakes match your current filters. Try adjusting the magnitude range or clearing the region search.
                </p>
                <button
                  onClick={() => {
                    setMinMag(0);
                    setMaxMag(10);
                    setRegionQuery("");
                    setTimeFilter("all");
                  }}
                  className="px-4 py-2 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Map */}
          {status === "success" && filteredQuakes.length > 0 && (
            <MapVisualizer 
              earthquakes={filteredQuakes} 
              selectedQuake={selectedQuake}
              onQuakeSelect={setSelectedQuake}
            />
          )}

          {/* Floating Stats Panel */}
          {showStats && stats && (
            <div className="absolute top-4 right-4 z-[1000]">
              <StatsPanel 
                stats={stats}
                onClose={() => setShowStats(false)}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}