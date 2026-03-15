
import React from 'react';
import { Stop, BusLocation } from '../types';
import { MapPinIcon } from './icons';
import BusMarker from './BusMarker';

// Stylized map background with greenery, roads, and terrain
const MapBackground = () => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
        <defs>
            <linearGradient id="terrain" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e7f3ea" />
                <stop offset="45%" stopColor="#d7e8f3" />
                <stop offset="100%" stopColor="#f3f7fb" />
            </linearGradient>
            <linearGradient id="roads" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6f93e6" />
                <stop offset="100%" stopColor="#a3b9f2" />
            </linearGradient>
            <radialGradient id="spot" cx="55%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
            <pattern id="dotGrid" width="12" height="12" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.6" fill="#9aa5b1" fillOpacity="0.2" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#terrain)" />
        <rect width="100%" height="100%" fill="url(#dotGrid)" />
        <rect width="100%" height="100%" fill="url(#spot)" />
        <path d="M -5 25 C 25 10, 40 10, 65 20 S 115 40, 120 55" fill="none" stroke="#c9d6ea" strokeWidth="7" strokeOpacity="0.55" />
        <path d="M -10 75 C 20 70, 45 60, 70 62 S 110 80, 120 90" fill="none" stroke="#d6dde8" strokeWidth="9" strokeOpacity="0.6" />
        <path d="M 5 15 C 30 30, 55 35, 85 30 S 105 25, 120 15" fill="none" stroke="url(#roads)" strokeWidth="2.5" strokeDasharray="3 3" strokeOpacity="0.75" />
        <path d="M 12 52 C 22 44, 36 42, 52 46 S 78 60, 96 70" fill="none" stroke="#6fbf7b" strokeWidth="8" strokeOpacity="0.35" />
        <path d="M 18 58 C 26 52, 40 50, 56 54 S 78 66, 92 74" fill="none" stroke="#7fcd8a" strokeWidth="4" strokeOpacity="0.3" />
        <circle cx="18" cy="22" r="10" fill="#7fcf8a" fillOpacity="0.25" />
        <circle cx="34" cy="26" r="6" fill="#6fbe7a" fillOpacity="0.25" />
        <circle cx="82" cy="18" r="12" fill="#8ad79a" fillOpacity="0.22" />
        <circle cx="72" cy="78" r="14" fill="#7fcf8a" fillOpacity="0.22" />
        <circle cx="55" cy="72" r="7" fill="#6fbe7a" fillOpacity="0.25" />
    </svg>
);

const generateRoutePath = (stops: Stop[]): string => {
    if (stops.length < 2) return '';
    // Sort stops to ensure the path is drawn in order
    const sortedStops = [...stops].sort((a, b) => a.id - b.id);
    const path = sortedStops.map((stop, index) => {
        const command = index === 0 ? 'M' : 'L';
        return `${command} ${stop.longitude} ${stop.latitude}`;
    }).join(' ');
    return path;
};


interface DummyMapProps {
    stops: Stop[];
    busLocations: BusLocation[];
    animate?: boolean; // Kept for potential future use, but logic is now external
}

const DummyMap: React.FC<DummyMapProps> = ({ stops, busLocations }) => {
    const routePaths = React.useMemo(() => {
        const routes: { [key: number]: Stop[] } = {};
        stops.forEach(stop => {
            if (!routes[stop.route_id]) {
                routes[stop.route_id] = [];
            }
            routes[stop.route_id].push(stop);
        });
        return Object.values(routes).map(routeStops => generateRoutePath(routeStops));
    }, [stops]);

    return (
        <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden border border-white/40 dark:border-white/10 bg-gradient-to-br from-emerald-50 via-sky-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.45)]">
             <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0">
                <MapBackground />
                {routePaths.map((path, index) => (
                    <g key={index}>
                        <path d={path} fill="none" stroke="#93c5fd" strokeWidth="2.4" strokeOpacity="0.6" />
                        <path d={path} fill="none" className="stroke-primary-500/80" strokeWidth="1.1" strokeDasharray="4 3" />
                    </g>
                ))}
            </svg>
            
            {/* Stops */}
            {stops.map(stop => (
                <div key={`stop-${stop.id}`} className="absolute transform -translate-x-1/2 -translate-y-full z-10" style={{ left: `${stop.longitude}%`, top: `${stop.latitude}%` }}>
                    <div className="flex items-center gap-1">
                        <div className="relative">
                            <span className="absolute inset-0 rounded-full bg-red-500/20 blur-md" />
                            <MapPinIcon className="w-6 h-6 text-red-500" />
                        </div>
                        <span className="text-[11px] bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-full shadow font-semibold border border-white/60 dark:border-white/10">
                            {stop.stop_name}
                        </span>
                    </div>
                </div>
            ))}

            {/* Buses */}
              {busLocations.map(location => (
                  <div key={`bus-${location.bus_id}`} className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear z-20" style={{ left: `${location.longitude}%`, top: `${location.latitude}%` }}>
                    <BusMarker busId={location.bus_id} />
                </div>
            ))}
        </div>
    );
};

export default DummyMap;