import { useState, useEffect } from "react";

export default function Loader() {
  const [loadingText, setLoadingText] = useState("Connecting to USGS...");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messages = [
      "Connecting to USGS...",
      "Fetching earthquake data...",
      "Processing seismic information...",
      "Preparing visualization..."
    ];

    let messageIndex = 0;
    let progressValue = 0;

    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      setLoadingText(messages[messageIndex]);
      
      progressValue = Math.min(progressValue + Math.random() * 25, 90);
      setProgress(progressValue);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Modern spinner with earthquake-themed animation */}
      <div className="relative">
        {/* Outer ring */}
        <div className="w-20 h-20 rounded-full border-4 border-slate-200 animate-pulse"></div>
        
        {/* Rotating earthquake waves */}
        <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-emerald-500 border-r-emerald-400 animate-spin"></div>
        
        {/* Inner seismic activity indicator */}
        <div className="absolute inset-3 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
          </svg>
        </div>

        {/* Pulse rings */}
        <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-emerald-300 animate-ping opacity-20"></div>
        <div className="absolute inset-2 w-16 h-16 rounded-full border-2 border-emerald-400 animate-ping opacity-30" style={{ animationDelay: '0.2s' }}></div>
      </div>

      {/* Loading text with typewriter effect */}
      <div className="mt-6 text-center">
        <p className="text-lg font-semibold text-slate-800 mb-2">
          {loadingText}
        </p>
        
        {/* Progress bar */}
        <div className="w-64 h-1 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-sm text-slate-500 mt-3">
          Fetching real-time seismic data from around the world
        </p>
      </div>

      {/* Loading dots animation */}
      <div className="flex gap-1 mt-4">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}