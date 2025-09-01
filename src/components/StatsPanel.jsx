export default function StatsPanel({ stats, onClose }) {
  if (!stats) return null;

  const formatNumber = (num) => {
    if (num === null || num === undefined) return "N/A";
    return typeof num === 'number' ? num.toFixed(1) : num.toString();
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 w-80 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">Statistics</h3>
            <p className="text-sm opacity-90">Current dataset analysis</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            title="Close statistics"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stats Content */}
      <div className="p-6 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-700">{stats.total}</div>
            <div className="text-sm text-emerald-600 font-medium">Total Events</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">{formatNumber(stats.avgMag)}</div>
            <div className="text-sm text-blue-600 font-medium">Avg Magnitude</div>
          </div>
        </div>

        {/* Magnitude Range */}
        <div>
          <h4 className="text-sm font-semibold text-slate-800 mb-3">
            Magnitude Range
          </h4>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Minimum</span>
              <span className="font-bold text-slate-900">M {formatNumber(stats.minMag)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Maximum</span>
              <span className="font-bold text-slate-900">M {formatNumber(stats.maxMag)}</span>
            </div>
          </div>
        </div>

        {/* Depth Information */}
        {stats.avgDepth !== null && (
          <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-3">
              Depth Analysis
            </h4>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Average Depth</span>
                <span className="font-bold text-slate-900">{formatNumber(stats.avgDepth)} km</span>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                {stats.avgDepth < 70 ? "Shallow earthquakes (most destructive)" :
                 stats.avgDepth < 300 ? "Intermediate depth earthquakes" :
                 "Deep earthquakes (less surface impact)"}
              </div>
            </div>
          </div>
        )}

        {/* Special Events */}
        {(stats.withTsunami > 0 || stats.significant > 0) && (
          <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-3">
              Special Events
            </h4>
            <div className="space-y-2">
              {stats.withTsunami > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-semibold text-orange-800 text-sm">
                        {stats.withTsunami} Tsunami {stats.withTsunami === 1 ? 'Warning' : 'Warnings'}
                      </div>
                      <div className="text-xs text-orange-600">
                        Earthquakes with tsunami potential
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {stats.significant > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <div>
                      <div className="font-semibold text-purple-800 text-sm">
                        {stats.significant} Significant {stats.significant === 1 ? 'Event' : 'Events'}
                      </div>
                      <div className="text-xs text-purple-600">
                        High significance earthquakes
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Activity Level Indicator */}
        <div>
          <h4 className="text-sm font-semibold text-slate-800 mb-3">
            Activity Level
          </h4>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                stats.total > 100 ? 'bg-red-500 animate-pulse' :
                stats.total > 50 ? 'bg-yellow-500' :
                'bg-green-500'
              }`} />
              <div>
                <div className="text-sm font-semibold text-slate-800">
                  {stats.total > 100 ? 'High Activity' :
                   stats.total > 50 ? 'Moderate Activity' :
                   'Normal Activity'}
                </div>
                <div className="text-xs text-slate-600">
                  Based on 24-hour earthquake count
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-xl p-4 text-white">
          <h4 className="text-sm font-semibold mb-2">Quick Insights</h4>
          <ul className="text-xs space-y-1 opacity-90">
            <li>• Most earthquakes occur along tectonic plate boundaries</li>
            <li>• The Pacific "Ring of Fire" shows highest activity</li>
            <li>• Magnitude increases logarithmically (M6 = 10x stronger than M5)</li>
            <li>• Shallow earthquakes (&lt;70km) cause more surface damage</li>
          </ul>
        </div>
      </div>
    </div>
  );
}