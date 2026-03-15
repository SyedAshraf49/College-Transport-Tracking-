
import React, { useState } from 'react';
import { useAuth } from '../../App';
import { Driver, Bus, Route as BusRoute } from '../../types';
import { MOCK_BUSES, MOCK_ROUTES } from '../../constants';
import Card from '../../components/Card';
import ThemeToggle from '../../components/ThemeToggle';
import { PowerIcon, QrCodeIcon, LogoutIcon } from '../../components/icons';

const DriverLayout: React.FC = () => {
    const { user, logout, isTripActive, toggleTrip, addNotification } = useAuth();
    const driver = user as Driver;
    const [bus] = useState<Bus | undefined>(MOCK_BUSES.find(b => b.driver_id === driver.id));
    const [route] = useState<BusRoute | undefined>(MOCK_ROUTES.find(r => r.id === bus?.route_id));
    const [isScanning, setIsScanning] = useState(false);
    const tripActive = bus ? isTripActive(bus.id) : false;

    const handleToggleTrip = () => {
        if (bus) {
            toggleTrip(bus.id);
        }
    };

    const handleAlert = (title: string, message: string) => {
        if (!bus) return;
        addNotification({
            title,
            message,
            bus_id: bus.id,
            target_roles: ['student', 'admin']
        });
        alert(`${title} alert sent.`);
    };

    return (
        <div className="min-h-screen text-gray-900 dark:text-gray-100 flex flex-col items-center p-3 sm:p-4">
            <div className="w-full max-w-lg">
                <header className="flex justify-between items-start sm:items-center mb-6 gap-3">
                     <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-primary-700 dark:text-primary-300">Driver Panel</h1>
                        <p className="text-gray-700 dark:text-gray-300 break-words">Welcome, {driver.name}</p>
                    </div>
                     <div className='flex items-center gap-4'>
                        <ThemeToggle />
                        <button onClick={logout} className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-red-500/20">
                           <LogoutIcon className="w-6 h-6" />
                        </button>
                    </div>
                </header>

                <main className="space-y-6">
                    <Card className="text-center">
                        <h2 className="text-xl font-bold mb-2">Trip Control</h2>
                        <p className={`text-lg font-semibold mb-4 ${tripActive ? 'text-green-400' : 'text-red-400'}`}>
                            Trip is {tripActive ? 'Active' : 'Inactive'}
                        </p>
                        <button
                            onClick={handleToggleTrip}
                            className={`w-full py-4 rounded-lg text-white font-bold text-xl transition-transform transform hover:scale-105 ${tripActive ? 'bg-red-500/70 hover:bg-red-500 border border-red-500/30' : 'bg-green-500/70 hover:bg-green-500 border border-green-500/30'}`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <PowerIcon className="w-6 h-6" />
                                <span>{tripActive ? 'Stop Trip' : 'Start Trip'}</span>
                            </div>
                        </button>
                    </Card>

                    <Card>
                        <h2 className="text-xl font-bold mb-2">Assigned Route</h2>
                        <p><span className="font-semibold">Bus Number:</span> {bus?.bus_number}</p>
                        <p><span className="font-semibold">Route:</span> {route?.route_name}</p>
                        <p><span className="font-semibold">From:</span> {route?.start_point}</p>
                        <p><span className="font-semibold">To:</span> {route?.end_point}</p>
                    </Card>

                    <Card className="text-center">
                        <h2 className="text-xl font-bold mb-4">Student Boarding</h2>
                        <button
                            onClick={() => setIsScanning(!isScanning)}
                            className="w-full py-4 bg-primary-500/70 text-white font-bold text-lg rounded-lg hover:bg-primary-500 transition border border-primary-500/30"
                        >
                             <div className="flex items-center justify-center gap-2">
                               <QrCodeIcon className="w-6 h-6" />
                               <span>{isScanning ? 'Close Scanner' : 'Scan QR Code'}</span>
                             </div>
                        </button>
                        {isScanning && (
                            <div className="mt-4 p-4 border-2 border-dashed border-white/30 rounded-lg aspect-square flex items-center justify-center">
                                <p className="text-gray-700 dark:text-gray-300">QR Scanner View</p>
                            </div>
                        )}
                    </Card>
                     <Card>
                        <h2 className="text-xl font-bold mb-4">Emergency Alerts</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                             <button
                                onClick={() => handleAlert(
                                    'Traffic Delay',
                                    `${bus?.bus_number} is delayed due to traffic on ${route?.route_name ?? 'its route'}.`
                                )}
                                className="w-full py-3 bg-yellow-500/70 text-white font-bold rounded-lg hover:bg-yellow-500 transition border-yellow-500/30"
                             >
                                Traffic Delay
                             </button>
                             <button
                                onClick={() => handleAlert(
                                    'Breakdown',
                                    `${bus?.bus_number} has reported a breakdown. Please await further updates.`
                                )}
                                className="w-full py-3 bg-orange-500/70 text-white font-bold rounded-lg hover:bg-orange-500 transition border-orange-500/30"
                             >
                                Breakdown
                             </button>
                        </div>
                    </Card>
                </main>
            </div>
        </div>
    );
};

export default DriverLayout;