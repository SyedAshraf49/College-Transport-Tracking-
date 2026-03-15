
import React from 'react';
import { BusIcon } from './icons';

interface BusMarkerProps {
  busId?: number;
  showLabel?: boolean;
  compact?: boolean;
}

const BusMarker: React.FC<BusMarkerProps> = ({ busId, showLabel = true, compact = false }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {!compact && <span className="absolute -inset-2 rounded-full bg-primary-400/30 blur-lg" />}
        {!compact && <span className="absolute inline-flex h-full w-full rounded-full bg-primary-400/70 opacity-75 animate-ping"></span>}
        <div className={`relative ${compact ? 'w-8 h-8 rounded-xl' : 'w-11 h-11 rounded-2xl'} bg-gradient-to-br from-primary-400 via-primary-500 to-primary-700 flex items-center justify-center shadow-xl border border-white/70 dark:border-white/10`}>
          <BusIcon className={`${compact ? 'w-4 h-4' : 'w-6 h-6'} text-white`} />
        </div>
        <div className={`absolute ${compact ? '-bottom-1.5 h-2.5 w-2.5' : '-bottom-2 h-3 w-3'} left-1/2 -translate-x-1/2 rotate-45 bg-primary-600 border-l border-b border-white/70 dark:border-white/10`} />
      </div>
      {busId && showLabel && (
        <span className="mt-2 text-[11px] bg-white/90 dark:bg-slate-900/90 px-2.5 py-1 rounded-full font-bold shadow border border-white/60 dark:border-white/10 text-slate-800 dark:text-slate-100">
          BUS-{String(busId).padStart(3, '0')}
        </span>
      )}
    </div>
  );
};

export default BusMarker;
