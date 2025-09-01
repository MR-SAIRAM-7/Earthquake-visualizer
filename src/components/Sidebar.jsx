import { useState, useMemo } from "react";
import { formatEpoch } from "../utils/format.js";

export default function Sidebar({
  minMag,
  maxMag,
  onMinMagChange,
  onMaxMagChange,
  regionQuery,
  onRegionQueryChange,
  timeFilter,
  onTimeFilterChange,
  count,
  total,
  isOpen,
  onToggle,
  selectedQuake,
  onQuakeSelect,
  quakes
}) {
  const [activeTab, setActiveTab] = useState("filters");

  // Quick region suggestions
  const regionSuggestions = ["California", "Alaska", "Japan", "Indonesia", "Chile", "Turkey"];

  // Group quakes by magnitude for quick stats
  const magStats = useMemo(() => {
    const stats = { low: 0, medium: 0, high: 0 };
    quakes.forEach(q => {
      if (q.mag < 4) stats.low++;
      else if (q.mag < 6) stats.medium++;
      else stats.high++;
    });
    return stats;
  }, [quakes]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`${
          isOpen ? "w-96" : "w-0 lg:w-16"
        } transition-all duration-300 bg-white/95 backdrop-blur-xl border-r border-slate-200/60 relative z-40 shadow-xl lg:shadow-none flex flex-col ${
          isOpen ? "fixed lg:relative inset-y-0 left-0" : ""
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="absolute -right-4 top-6 bg-white border border-slate-200 shadow-lg rounded-full w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:shadow-xl transition-all duration-200 z-50"
          title={isOpen ? "Close Panel" : "Open Panel"}
        >
          <svg 
            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {isOpen && (
          <>
            {/* Tab Navigation */}
            <div className="border-b border-slate-200/60 bg-slate-50/50">
              <nav className="flex">
                {[
                  { id: "filters", label: "Filters", icon: "M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" },
                  { id: "list", label: "List", icon: "M4 6h16M4 10h16M4 14h16M4 18h16" },
                  { id: "stats", label: "Stats", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'text-slate-900 border-b-2 border-slate-900 bg-white'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <svg className="w-4 h-4 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                    </svg>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === "filters" && (
                <div className="p-6 space-y-6">
                  {/* Quick Stats Cards */}
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="bg-green-50 rounded-xl p-3 text-center">
                      <div className="text-lg font-bold text-green-700">{magStats.low}</div>
                      <div className="text-xs text-green-600">Low &lt;4</div>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-3 text-center">
                      <div className="text-lg font-bold text-yellow-700">{magStats.medium}</div>
                      <div className="text-xs text-yellow-600">Med 4-6</div>
                    </div>
                    <div className="bg-red-50 rounded-xl p-3 text-center">
                      <div className="text-lg font-bold text-red-700">{magStats.high}</div>
                      <div className="text-xs text-red-600">High &gt;6</div>
                    </div>
                  </div>

                  {/* Time Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-3">
                      Time Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: "all", label: "All Day" },
                        { value: "1h", label: "1 Hour" },
                        { value: "6h", label: "6 Hours" },
                        { value: "12h", label: "12 Hours" }
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => onTimeFilterChange(option.value)}
                          className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                            timeFilter === option.value
                              ? 'bg-slate-900 text-white shadow-lg'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Magnitude Range */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-3">
                      Magnitude Range: {minMag.toFixed(1)} - {maxMag.toFixed(1)}
                    </label>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-2">
                          <span>Min: {minMag.toFixed(1)}</span>
                          <span>Max: {maxMag.toFixed(1)}</span>
                        </div>
                        
                        <div className="relative">
                          <input
                            type="range"
                            min="0"
                            max="10"
                            step="0.1"
                            value={minMag}
                            onChange={(e) => onMinMagChange(Math.min(Number(e.target.value), maxMag - 0.1))}
                            className="w-full h-2 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <input
                            type="range"
                            min="0"
                            max="10"
                            step="0.1"
                            value={maxMag}
                            onChange={(e) => onMaxMagChange(Math.max(Number(e.target.value), minMag + 0.1))}
                            className="absolute top-0 w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Region Search */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-3">
                      Search Location
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={regionQuery}
                        onChange={(e) => onRegionQueryChange(e.target.value)}
                        placeholder="Enter region, country, or state..."
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all duration-200 pl-10"
                      />
                      <svg className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    
                    {/* Quick region buttons */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {regionSuggestions.map(region => (
                        <button
                          key={region}
                          onClick={() => onRegionQueryChange(region)}
                          className="px-3 py-1 text-xs bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-900 hover:text-white transition-all duration-200"
                        >
                          {region}
                        </button>
                      ))}
                    </div>
                    
                    {/* Clear button */}
                    {regionQuery && (
                      <button
                        onClick={() => onRegionQueryChange("")}
                        className="mt-2 text-xs text-slate-500 hover:text-slate-700 underline"
                      >
                        Clear search
                      </button>
                    )}
                  </div>

                  {/* Results Summary */}
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">{count}</div>
                      <div className="text-sm text-slate-600">
                        {count === 1 ? 'earthquake' : 'earthquakes'} shown
                      </div>
                      {total && total !== count && (
                        <div className="text-xs text-slate-500 mt-1">
                          of {total} total
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "list" && (
                <div className="p-4">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-slate-800 mb-2">
                      Recent Earthquakes
                    </h3>
                    <p className="text-xs text-slate-500">
                      Click any earthquake to highlight on map
                    </p>
                  </div>
                  
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {quakes.slice(0, 20).map(quake => (
                      <button
                        key={quake.id}
                        onClick={() => onQuakeSelect(quake)}
                        className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                          selectedQuake?.id === quake.id
                            ? 'bg-blue-100 border-2 border-blue-300 shadow-md'
                            : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span 
                                className={`w-3 h-3 rounded-full ${
                                  quake.mag >= 6 ? 'bg-red-500' :
                                  quake.mag >= 4 ? 'bg-yellow-400' : 'bg-green-500'
                                }`}
                              />
                              <span className="font-semibold text-slate-900">
                                M{quake.mag.toFixed(1)}
                              </span>
                            </div>
                            <div className="text-sm text-slate-700 truncate mb-1">
                              {quake.place}
                            </div>
                            <div className="text-xs text-slate-500">
                              {quake.time ? formatEpoch(quake.time) : "Unknown time"}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                    
                    {quakes.length > 20 && (
                      <div className="text-center py-2 text-xs text-slate-500">
                        Showing 20 of {quakes.length} earthquakes
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "stats" && (
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-4">
                      Distribution by Magnitude
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-slate-700">Low (&lt;4.0)</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{magStats.low}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <span className="text-sm text-slate-700">Medium (4.0-6.0)</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{magStats.medium}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-slate-700">High (&gt;6.0)</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{magStats.high}</span>
                      </div>
                    </div>
                  </div>

                  {/* Visual magnitude bars */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-3">
                      Activity Distribution
                    </h3>
                    
                    <div className="space-y-2">
                      {[
                        { label: "Low", count: magStats.low, color: "bg-green-500" },
                        { label: "Medium", count: magStats.medium, color: "bg-yellow-400" },
                        { label: "High", count: magStats.high, color: "bg-red-500" }
                      ].map(item => {
                        const percentage = total ? (item.count / total) * 100 : 0;
                        return (
                          <div key={item.label}>
                            <div className="flex justify-between text-xs text-slate-600 mb-1">
                              <span>{item.label}</span>
                              <span>{percentage.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${item.color} transition-all duration-500`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-slate-800 mb-2">
                      About the Data
                    </h4>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>• Updates every 5 minutes</li>
                      <li>• Data from USGS Earthquake Hazards Program</li>
                      <li>• Includes all earthquakes from past 24 hours</li>
                      <li>• Marker size scales with magnitude</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Collapsed state mini controls */}
        {!isOpen && (
          <div className="hidden lg:flex flex-col items-center py-4 space-y-4">
            <div className="text-xs text-slate-500 writing-mode-vertical transform rotate-180">
              {count}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}