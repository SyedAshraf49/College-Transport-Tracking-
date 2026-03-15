
import React from 'react';
import { BusIcon } from './icons';

interface BusMarkerProps {
  busId?: number;
}

const BusMarker: React.FC<BusMarkerProps> = ({ busId }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <span className="absolute -inset-2 rounded-full bg-primary-400/30 blur-lg" />
        <span className="absolute inline-flex h-full w-full rounded-full bg-primary-400/70 opacity-75 animate-ping"></span>
        <div className="relative w-11 h-11 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-xl border border-white/70 dark:border-white/10">
          <BusIcon className="w-6 h-6 text-white" />
        </div>
        <div className="absolute -bottom-2 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-primary-600 border-l border-b border-white/70 dark:border-white/10" />
      </div>
      {busId && (
        <span className="mt-2 text-[11px] bg-white/90 dark:bg-slate-900/90 px-2.5 py-1 rounded-full font-bold shadow border border-white/60 dark:border-white/10 text-slate-800 dark:text-slate-100">
          BUS-{String(busId).padStart(3, '0')}
        </span>
      )}
    </div>
  );
};

export default BusMarker;
