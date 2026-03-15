
import React from 'react';
import Card from '../../components/Card';
import { MOCK_STOPS } from '../../constants';
import { Stop } from '../../types';
import DummyMap from '../../components/DummyMap';
import { useAuth } from '../../App';

const LiveMapOverview: React.FC = () => {
    const { busLocations } = useAuth();
    const allStops: Stop[] = MOCK_STOPS;
    const [isMobile, setIsMobile] = React.useState<boolean>(window.innerWidth < 768);
    const [showStopLabels, setShowStopLabels] = React.useState<boolean>(window.innerWidth >= 768);
    const [showBusLabels, setShowBusLabels] = React.useState<boolean>(true);

    React.useEffect(() => {
        const onResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) {
                setShowStopLabels(true);
                setShowBusLabels(true);
            }
        };

        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return (
        <Card>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold">Live Map Overview</h1>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => setShowStopLabels(prev => !prev)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${showStopLabels ? 'bg-primary-500/20 border-primary-400/40 text-primary-700 dark:text-primary-200' : 'bg-white/10 border-white/20 text-gray-700 dark:text-gray-300'}`}
                    >
                        {showStopLabels ? 'Hide Stop Names' : 'Show Stop Names'}
                    </button>
                    <button
                        onClick={() => setShowBusLabels(prev => !prev)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${showBusLabels ? 'bg-primary-500/20 border-primary-400/40 text-primary-700 dark:text-primary-200' : 'bg-white/10 border-white/20 text-gray-700 dark:text-gray-300'}`}
                    >
                        {showBusLabels ? 'Hide Bus IDs' : 'Show Bus IDs'}
                    </button>
                </div>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                Tip: On mobile, turning off stop names gives a cleaner, smoother live map.
            </p>
            <DummyMap
                stops={allStops}
                busLocations={busLocations}
                showStopLabels={showStopLabels}
                showBusLabels={showBusLabels}
                compact={isMobile}
            />
        </Card>
    );
};

export default LiveMapOverview;