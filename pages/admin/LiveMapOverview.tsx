
import React from 'react';
import Card from '../../components/Card';
import { MOCK_STOPS } from '../../constants';
import { Stop } from '../../types';
import DummyMap from '../../components/DummyMap';
import { useAuth } from '../../App';

const LiveMapOverview: React.FC = () => {
    const { busLocations } = useAuth();
    const allStops: Stop[] = MOCK_STOPS;

    return (
        <Card>
            <h1 className="text-3xl font-bold mb-6">Live Map Overview</h1>
            <DummyMap stops={allStops} busLocations={busLocations} />
        </Card>
    );
};

export default LiveMapOverview;