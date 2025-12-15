
import React from 'react';
import { BusIcon } from './icons';

interface BusMarkerProps {
  busId?: number;
}

const BusMarker: React.FC<BusMarkerProps> = ({ busId }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <span className="absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75 animate-ping"></span>
        <div className="relative w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800">
          <BusIcon className="w-6 h-6 text-white" />
        </div>
      </div>
      {busId && (
        <span className="mt-2 text-xs bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded-full font-bold shadow">
          BUS-{String(busId).padStart(3, '0')}
        </span>
      )}
    </div>
  );
};

export default BusMarker;
