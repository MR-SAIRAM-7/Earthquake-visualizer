/**
 * Floating legend overlayed on the map.
 * This duplicates the sidebar legend for convenience on mobile.
 */
export default function Legend() {
  return (
    <div className="absolute left-3 bottom-3 z-[1000]">
      <div className="bg-white/90 backdrop-blur rounded-xl shadow-soft p-3">
        <h4 className="text-xs font-semibold text-slate-700 mb-2">Legend</h4>
        <ul className="space-y-1 text-xs text-slate-700">
          <li className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
            &lt; 4.0
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-yellow-400"></span>
            4.0 – 6.0
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
            &gt; 6.0
          </li>
        </ul>
      </div>
    </div>
  );
}
