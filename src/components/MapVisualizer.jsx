import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import Legend from "./Legend.jsx";
import { formatEpoch } from "../utils/format.js";

/**
 * Enhanced color scheme with more vibrant colors
 */
function colorForMag(m) {
  if (m >= 7) return "#dc2626"; // red-600 - Major
  if (m >= 6) return "#ea580c"; // orange-600 - Strong  
  if (m >= 5) return "#d97706"; // amber-600 - Moderate
  if (m >= 4) return "#eab308"; // yellow-500 - Light
  if (m >= 3) return "#65a30d"; // lime-600 - Minor
  return "#16a34a"; // green-600 - Micro
}

/**
 * Enhanced radius calculation with better scaling
 */
function radiusForMag(m) {
  if (m <= 0) return 4;
  // Exponential scaling for better visual differentiation
  const base = Math.pow(m, 1.5) * 1.8;
  return Math.max(4, Math.min(base, 40));
}

/**
 * Component to handle map effects and selected earthquake highlighting
 */
function MapEffects({ selectedQuake, earthquakes }) {
  const map = useMap();

  useEffect(() => {
    if (selectedQuake) {
      // Smooth fly to selected earthquake
      map.flyTo([selectedQuake.lat, selectedQuake.lon], Math.max(map.getZoom(), 6), {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [selectedQuake, map]);

  return null;
}

/**
 * Enhanced earthquake marker with better popup and interactions
 */
function EarthquakeMarker({ earthquake, isSelected, onSelect }) {
  const color = colorForMag(earthquake.mag);
  const radius = radiusForMag(earthquake.mag);
  
  // Enhanced styling based on selection and magnitude
  const pathOptions = {
    color: isSelected ? '#1e40af' : color,
    fillColor: color,
    fillOpacity: isSelected ? 0.9 : 0.7,
    weight: isSelected ? 3 : 2,
    opacity: 1,
  };

  return (
    <CircleMarker
      center={[earthquake.lat, earthquake.lon]}
      pathOptions={pathOptions}
      radius={isSelected ? radius * 1.3 : radius}
      eventHandlers={{
        click: () => onSelect(earthquake),
        mouseover: (e) => {
          e.target.setStyle({ fillOpacity: 0.9, weight: 3 });
        },
        mouseout: (e) => {
          if (!isSelected) {
            e.target.setStyle({ fillOpacity: 0.7, weight: 2 });
          }
        }
      }}
    >
      <Popup className="earthquake-popup">
        <div className="text-sm max-w-xs">
          {/* Header with magnitude and severity indicator */}
          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-200">
            <div 
              className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: color }}
            />
            <div>
              <div className="font-bold text-lg text-slate-900">
                M {earthquake.mag.toFixed(1)}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {earthquake.mag >= 7 ? 'Major' :
                 earthquake.mag >= 6 ? 'Strong' :
                 earthquake.mag >= 5 ? 'Moderate' :
                 earthquake.mag >= 4 ? 'Light' :
                 earthquake.mag >= 3 ? 'Minor' : 'Micro'}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-3">
            <div className="font-semibold text-slate-800 mb-1">
              {earthquake.place}
            </div>
            <div className="text-xs text-slate-500">
              {earthquake.lat.toFixed(3)}°, {earthquake.lon.toFixed(3)}°
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="font-medium text-slate-600">Time:</span>
              <div className="text-slate-800 mt-1">
                {earthquake.time ? formatEpoch(earthquake.time) : "Unknown"}
              </div>
            </div>
            
            <div>
              <span className="font-medium text-slate-600">Depth:</span>
              <div className="text-slate-800 mt-1">
                {earthquake.depth !== null ? `${earthquake.depth} km` : "N/A"}
              </div>
            </div>

            {earthquake.significance > 0 && (
              <div>
                <span className="font-medium text-slate-600">Significance:</span>
                <div className="text-slate-800 mt-1">{earthquake.significance}</div>
              </div>
            )}

            {earthquake.felt && (
              <div>
                <span className="font-medium text-slate-600">Felt Reports:</span>
                <div className="text-slate-800 mt-1">{earthquake.felt}</div>
              </div>
            )}
          </div>

          {/* Tsunami warning */}
          {earthquake.tsunami === 1 && (
            <div className="mt-3 p-2 bg-orange-100 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 text-orange-800">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-medium">Tsunami Warning</span>
              </div>
            </div>
          )}

          {/* USGS Link */}
          {earthquake.url && (
            <div className="mt-4 pt-3 border-t border-slate-200">
              <a
                href={earthquake.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
              >
                <span>View Details on USGS</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </Popup>
    </CircleMarker>
  );
}

export default function MapVisualizer({ earthquakes, selectedQuake, onQuakeSelect }) {
  const [mapStyle, setMapStyle] = useState("streets");
  
  // Map configuration
  const center = [20, 0]; // Slightly north for better world view
  const zoom = 2;

  // Available map styles
  const mapStyles = {
    streets: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      name: "Streets"
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
      name: "Satellite"
    },
    dark: {
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      name: "Dark"
    }
  };

  return (
    <div className="h-full relative bg-slate-100">
      <MapContainer
        center={center}
        zoom={zoom}
        minZoom={2}
        maxZoom={18}
        worldCopyJump
        zoomControl={false} // We'll add custom controls
        className="h-full rounded-none lg:rounded-2xl lg:m-4 shadow-2xl"
        style={{ 
          background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)'
        }}
      >
        <TileLayer
          attribution={mapStyles[mapStyle].attribution}
          url={mapStyles[mapStyle].url}
          className="map-tiles"
        />

        {/* Map Effects */}
        <MapEffects selectedQuake={selectedQuake} earthquakes={earthquakes} />

        {/* Earthquake Markers */}
        {earthquakes.map((earthquake) => (
          <EarthquakeMarker
            key={earthquake.id}
            earthquake={earthquake}
            isSelected={selectedQuake?.id === earthquake.id}
            onSelect={onQuakeSelect}
          />
        ))}
      </MapContainer>

      {/* Floating Map Controls */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
        {/* Map Style Switcher */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-2">
          <div className="flex gap-1">
            {Object.entries(mapStyles).map(([key, style]) => (
              <button
                key={key}
                onClick={() => setMapStyle(key)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                  mapStyle === key
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                title={`Switch to ${style.name} view`}
              >
                {style.name}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Enhanced Legend */}
      <Legend earthquakes={earthquakes} />

      {/* Earthquake Count Badge */}
      <div className="absolute bottom-4 right-4 z-[1000]">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 px-4 py-2">
          <div className="text-center">
            <div className="text-lg font-bold text-slate-900">{earthquakes.length}</div>
            <div className="text-xs text-slate-600 font-medium">
              {earthquakes.length === 1 ? 'earthquake' : 'earthquakes'}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Earthquake Info Card */}
      {selectedQuake && (
        <div className="absolute top-4 right-4 z-[1000] max-w-sm">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold">M {selectedQuake.mag.toFixed(1)}</div>
                  <div className="text-sm opacity-90">{selectedQuake.place}</div>
                </div>
                <button
                  onClick={() => onQuakeSelect(null)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-slate-600">Time:</span>
                  <div className="text-slate-900 mt-1">
                    {selectedQuake.time ? formatEpoch(selectedQuake.time) : "Unknown"}
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-slate-600">Depth:</span>
                  <div className="text-slate-900 mt-1">
                    {selectedQuake.depth !== null ? `${selectedQuake.depth} km` : "N/A"}
                  </div>
                </div>
              </div>

              {selectedQuake.significance > 600 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-medium">Significant Event</span>
                  </div>
                </div>
              )}

              {selectedQuake.url && (
                <a
                  href={selectedQuake.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium w-full justify-center bg-blue-50 hover:bg-blue-100 rounded-lg py-2 px-3"
                >
                  <span>View on USGS</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}