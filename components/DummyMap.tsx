
import React from 'react';
import { Stop, BusLocation } from '../types';
import { MapPinIcon } from './icons';
import BusMarker from './BusMarker';

// A more realistic map background component
const MapBackground = () => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
        <defs>
            <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" className="stroke-gray-200 dark:stroke-gray-700/50" strokeWidth="0.5"/>
            </pattern>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <rect width="40" height="40" fill="url(#smallGrid)"/>
                <path d="M 40 0 L 0 0 0 40" fill="none" className="stroke-gray-300 dark:stroke-gray-600/70" strokeWidth="1"/>
            </pattern>
        </defs>
        <rect width="100%" height="100%" className="fill-gray-100 dark:fill-gray-800" />
        <rect width="100%" height="100%" fill="url(#grid)" />
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
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden border-2 border-primary-200 dark:border-primary-700 bg-blue-50 dark:bg-gray-800">
             <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0">
                <MapBackground />
                {routePaths.map((path, index) => (
                    <path key={index} d={path} fill="none" className="stroke-primary-500/50" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
                ))}
            </svg>
            
            {/* Stops */}
            {stops.map(stop => (
                <div key={`stop-${stop.id}`} className="absolute transform -translate-x-1/2 -translate-y-full z-10" style={{ left: `${stop.longitude}%`, top: `${stop.latitude}%` }}>
                    <MapPinIcon className="w-6 h-6 text-red-500" />
                    <span className="text-xs bg-white/80 dark:bg-gray-900/80 px-2 py-0.5 rounded-full -ml-2 shadow font-medium">{stop.stop_name}</span>
                </div>
            ))}

            {/* Buses */}
            {busLocations.map(location => (
                 <div key={`bus-${location.bus_id}`} className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-linear z-20" style={{ left: `${location.longitude}%`, top: `${location.latitude}%` }}>
                    <BusMarker busId={location.bus_id} />
                </div>
            ))}
        </div>
    );
};

export default DummyMap;