
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../App';
import { MOCK_BUSES, MOCK_ROUTES, MOCK_STOPS, MOCK_NOTIFICATIONS, MOCK_DRIVERS } from '../../constants';
import { Student, Bus, Route as BusRoute, Stop, Notification, Driver, BusLocation } from '../../types';
import Card from '../../components/Card';
import DummyMap from '../../components/DummyMap';
import ThemeToggle from '../../components/ThemeToggle';
import { MapIcon, BellIcon, UserCircleIcon, BusIcon, LogoutIcon, TicketIcon } from '../../components/icons';
import QRCodeModal from '../../components/QRCodeModal';

type ActiveView = 'dashboard' | 'map' | 'notifications' | 'profile';

const StudentLayout: React.FC = () => {
    const { user, logout, busLocations, isTripActive } = useAuth();
    const student = user as Student;
    const [activeView, setActiveView] = useState<ActiveView>('dashboard');
    const [bus] = useState<Bus | undefined>(MOCK_BUSES.find(b => b.id === student.bus_id));
    const [route] = useState<BusRoute | undefined>(MOCK_ROUTES.find(r => r.id === bus?.route_id));
    const [stops] = useState<Stop[]>(MOCK_STOPS.filter(s => s.route_id === bus?.route_id));
    const [driver] = useState<Driver | undefined>(MOCK_DRIVERS.find(d => d.id === bus?.driver_id));
    const [studentStop] = useState<Stop | undefined>(stops.find(s => s.id === student.stop_id));
    const [busLocation, setBusLocation] = useState<BusLocation | undefined>(busLocations.find(l => l.bus_id === student.bus_id));
    const [eta, setEta] = useState<number | null>(null);

    useEffect(() => {
        const currentBusLocation = busLocations.find(l => l.bus_id === student.bus_id);
        setBusLocation(currentBusLocation);
    }, [busLocations, student.bus_id]);

    useEffect(() => {
        if (studentStop && busLocation && isTripActive) {
            const distance = Math.sqrt(Math.pow(studentStop.latitude - busLocation.latitude, 2) + Math.pow(studentStop.longitude - busLocation.longitude, 2));
            const mockEta = Math.round(distance / 3); // Assuming avg speed factor
            setEta(mockEta);
        } else {
            setEta(null);
        }
    }, [busLocation, studentStop, isTripActive]);

    const renderContent = () => {
        if (!busLocation) return <div>Loading bus data...</div>;
        switch(activeView) {
            case 'dashboard':
                return <StudentDashboard {...{student, bus, route, driver, studentStop, eta, stops, busLocation, isTripActive}} />;
            case 'map':
                return <LiveTrackingMap {...{stops, busLocation, isTripActive}} />;
            case 'notifications':
                return <Notifications />;
            case 'profile':
                return <Profile {...{student, logout}} />;
        }
    }

    return (
        <div className="min-h-screen text-gray-900 dark:text-gray-100 flex flex-col">
            <header className="bg-white/20 dark:bg-black/20 backdrop-blur-lg shadow-lg p-4 flex justify-between items-center sticky top-0 z-10 border-b border-white/20">
                <div>
                    <h1 className="text-xl font-bold text-primary-700 dark:text-primary-300">Welcome, {student.name}</h1>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Student Dashboard</p>
                </div>
                <div className='flex items-center gap-4'>
                    <ThemeToggle />
                     <button onClick={logout} className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-red-500/20">
                        <LogoutIcon className="w-6 h-6" />
                    </button>
                </div>
            </header>

            <main className="flex-grow p-4 mb-16">
                {renderContent()}
            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-white/20 dark:bg-black/20 backdrop-blur-lg shadow-lg border-t border-white/20">
                <nav className="flex justify-around p-2">
                    <NavItem icon={<BusIcon className="w-6 h-6" />} label="Home" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
                    <NavItem icon={<MapIcon className="w-6 h-6" />} label="Map" active={activeView === 'map'} onClick={() => setActiveView('map')} />
                    <NavItem icon={<BellIcon className="w-6 h-6" />} label="Alerts" active={activeView === 'notifications'} onClick={() => setActiveView('notifications')} />
                    <NavItem icon={<UserCircleIcon className="w-6 h-6" />} label="Profile" active={activeView === 'profile'} onClick={() => setActiveView('profile')} />
                </nav>
            </footer>
        </div>
    );
};

const NavItem: React.FC<{icon: React.ReactNode, label: string, active: boolean, onClick: () => void}> = ({icon, label, active, onClick}) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-20 p-2 rounded-lg transition-colors duration-200 ${active ? 'text-primary-600 dark:text-primary-300 bg-primary-500/20' : 'text-gray-600 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-black/20'}`}>
        {icon}
        <span className="text-xs mt-1">{label}</span>
    </button>
);

const StudentDashboard: React.FC<{
    student: Student, 
    bus?: Bus, 
    route?: BusRoute, 
    driver?: Driver, 
    studentStop?: Stop, 
    eta: number | null,
    stops: Stop[],
    busLocation: BusLocation,
    isTripActive: boolean,
}> = ({ student, bus, route, driver, studentStop, eta, stops, busLocation, isTripActive }) => (
    <div className="space-y-6">
        <Card>
            <h2 className="text-2xl font-bold mb-4">Your Bus Status</h2>
            <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">ETA to Your Stop</p>
                    {isTripActive && eta !== null ? (
                         <p className="text-3xl font-bold text-primary-600 dark:text-primary-300">{eta} <span className="text-lg">min</span></p>
                    ) : (
                         <p className="text-lg font-semibold text-gray-500">Not Started</p>
                    )}
                </div>
                <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Your Stop</p>
                    <p className="text-lg font-semibold">{studentStop?.stop_name}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Bus Number</p>
                    <p className="text-lg font-semibold">{bus?.bus_number}</p>
                </div>
                 <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Seat Availability</p>
                    <p className="text-lg font-semibold">{bus ? `${bus.capacity - bus.occupancy}/${bus.capacity}` : 'N/A'}</p>
                </div>
            </div>
        </Card>
        <Card>
             <h2 className="text-xl font-bold mb-4">Route Information</h2>
             <div className="space-y-2 mb-4">
                <p><span className="font-semibold">Route Name:</span> {route?.route_name}</p>
                <p><span className="font-semibold">From:</span> {route?.start_point}</p>
                <p><span className="font-semibold">To:</span> {route?.end_point}</p>
             </div>
             <DummyMap stops={stops} busLocations={[busLocation]} />
        </Card>
        <Card>
            <h2 className="text-xl font-bold mb-4">Driver Details</h2>
            {driver && (
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <UserCircleIcon className="w-10 h-10 text-gray-500" />
                    </div>
                    <div>
                        <p className="font-bold text-lg">{driver.name}</p>
                        <p className="text-gray-700 dark:text-gray-300">{driver.phone}</p>
                    </div>
                </div>
            )}
        </Card>
    </div>
);

const LiveTrackingMap: React.FC<{stops: Stop[], busLocation: BusLocation, isTripActive: boolean}> = ({ stops, busLocation, isTripActive }) => (
    <Card>
        <h2 className="text-2xl font-bold mb-4">Live Bus Tracking</h2>
        <DummyMap stops={stops} busLocations={[busLocation]} animate={isTripActive} />
    </Card>
);

const Notifications: React.FC = () => (
    <Card>
        <h2 className="text-2xl font-bold mb-4">Notifications</h2>
        <div className="space-y-4">
            {MOCK_NOTIFICATIONS.map(notif => (
                <div key={notif.id} className="p-4 rounded-lg bg-black/10 dark:bg-white/10 border border-white/10">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg text-primary-700 dark:text-primary-300">{notif.title}</h3>
                        <span className="text-xs text-gray-700 dark:text-gray-300">{notif.date}</span>
                    </div>
                    <p className="mt-1 text-gray-800 dark:text-gray-200">{notif.message}</p>
                </div>
            ))}
        </div>
    </Card>
);

const Profile: React.FC<{student: Student, logout: () => void}> = ({ student }) => {
    const [isSosConfirmVisible, setIsSosConfirmVisible] = useState(false);
    const [isQrVisible, setIsQrVisible] = useState(false);

    const handleSosActivate = () => {
        // In a real app, this would get the user's location and send it to a server.
        alert('SOS Activated! Your location has been sent to the administrator.');
        setIsSosConfirmVisible(false);
    };
    
    const qrData = JSON.stringify({
        studentId: student.id,
        name: student.name,
        busId: student.bus_id,
        timestamp: Date.now(),
    });

    return (
        <>
            <Card>
                <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
                <div className="space-y-3">
                    <p><span className="font-semibold">Name:</span> {student.name}</p>
                    <p><span className="font-semibold">Roll No:</span> {student.roll_no}</p>
                    <p><span className="font-semibold">Email:</span> {student.email}</p>
                    <p><span className="font-semibold">Bus ID:</span> {student.bus_id}</p>
                    <p><span className="font-semibold">Stop ID:</span> {student.stop_id}</p>
                </div>
                <button 
                    onClick={() => setIsQrVisible(true)}
                    className="mt-6 w-full bg-primary-500/70 backdrop-blur-md border border-primary-500/30 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-500 transition flex items-center justify-center gap-2">
                    <TicketIcon className="w-6 h-6" />
                    <span>Show Boarding Pass</span>
                </button>
                <button 
                    onClick={() => setIsSosConfirmVisible(true)}
                    className="mt-4 w-full bg-red-500/70 backdrop-blur-md border border-red-500/30 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-500 transition">
                    SOS
                </button>
            </Card>

            {isSosConfirmVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white/20 dark:bg-black/20 backdrop-blur-xl rounded-2xl shadow-xl p-6 w-full max-w-sm border border-white/20">
                        <h3 className="text-xl font-bold text-center mb-4">Confirm SOS Activation</h3>
                        <p className="text-center text-gray-800 dark:text-gray-200 mb-6">
                            Are you sure? This will immediately send your location to the administrator as an emergency alert.
                        </p>
                        <div className="flex justify-around gap-4">
                            <button
                                onClick={() => setIsSosConfirmVisible(false)}
                                className="w-full bg-gray-500/50 backdrop-blur-md border border-gray-500/30 font-bold py-2 px-4 rounded-lg hover:bg-gray-500/70 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSosActivate}
                                className="w-full bg-red-500/70 backdrop-blur-md border border-red-500/30 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-500 transition"
                            >
                                Confirm SOS
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {isQrVisible && (
                <QRCodeModal
                    data={qrData}
                    onClose={() => setIsQrVisible(false)}
                    title="Your Boarding Pass"
                />
            )}
        </>
    );
};


export default StudentLayout;