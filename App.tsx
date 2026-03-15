
import React, { useState, useMemo, createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, BusLocation, Notification } from './types';
import { MOCK_STUDENTS, MOCK_DRIVERS, MOCK_ADMIN, MOCK_BUSES, MOCK_STOPS, MOCK_BUS_LOCATIONS, MOCK_NOTIFICATIONS, MOCK_ROUTES } from './constants';
import LoginPage from './pages/Login';
import StudentLayout from './pages/student/StudentLayout';
import DriverLayout from './pages/driver/DriverLayout';
import AdminLayout from './pages/admin/AdminLayout';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type AuthContextType = {
    user: User | null;
    login: (email: string, password: string) => void;
    logout: () => void;
    isTripActive: (busId: number) => boolean;
    toggleTrip: (driverBusId: number) => void;
    busLocations: BusLocation[];
    busLoopDurations: Record<number, number>;
    notifications: Notification[];
    addNotification: (input: Omit<Notification, 'id' | 'date'> & { date?: string }) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const App: React.FC = () => {
    const BUS_TICK_INTERVAL_MS = 1000;
    const BUS_STEPS_PER_SEGMENT = 30; // 30 seconds between each stop
    const BUS_PROGRESS_STEP = 1 / BUS_STEPS_PER_SEGMENT;
    const END_STOP_NAME = 'College Gate';
    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
    const [user, setUser] = useState<User | null>(null);
    const [activeTrips, setActiveTrips] = useState<Record<number, boolean>>({});
    const [busLocations, setBusLocations] = useState<BusLocation[]>(MOCK_BUS_LOCATIONS);
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    const [busLoopDurations, setBusLoopDurations] = useState<Record<number, number>>({});
    const busProgressRef = useRef<Record<number, { stopIndex: number; progress: number }>>({});
    const tripMetaRef = useRef<Record<number, { startIndex: number; endIndex: number }>>({});
    const tripCompletedRef = useRef<Record<number, boolean>>({});
    const busPauseUntilRef = useRef<Record<number, number>>({});
    const nextNotificationId = useRef<number>(
        MOCK_NOTIFICATIONS.reduce((maxId, notif) => Math.max(maxId, notif.id), 0) + 1
    );

    const createNotificationDate = () => new Date().toISOString().slice(0, 10);

    const pushNotification = useCallback((input: Omit<Notification, 'id' | 'date'> & { date?: string }) => {
        const nextId = nextNotificationId.current++;
        const nextDate = input.date ?? createNotificationDate();
        const nextNotification: Notification = { ...input, id: nextId, date: nextDate };
        setNotifications(prev => [nextNotification, ...prev]);
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        const activeBusIds = Object.keys(activeTrips)
            .map(Number)
            .filter(busId => activeTrips[busId]);
        if (activeBusIds.length === 0) return;

        const interval = setInterval(() => {
            const completedBusIds: number[] = [];

            setBusLocations(prev => {
                return prev.map(location => {
                    if (!activeTrips[location.bus_id]) return location;

                    const bus = MOCK_BUSES.find(b => b.id === location.bus_id);
                    if (!bus) return location;

                    const routeStops = MOCK_STOPS
                        .filter(s => s.route_id === bus.route_id)
                        .sort((a, b) => a.id - b.id);
                    if (routeStops.length < 2) return location;

                    const pauseUntil = busPauseUntilRef.current[bus.id];
                    if (pauseUntil && Date.now() < pauseUntil) {
                        return location;
                    }
                    if (pauseUntil && Date.now() >= pauseUntil) {
                        busPauseUntilRef.current[bus.id] = 0;
                    }
                    const meta = tripMetaRef.current[bus.id];
                    const startIndex = meta?.startIndex ?? 0;
                    const endIndex = meta?.endIndex ?? routeStops.length - 1;
                    const state = busProgressRef.current[bus.id] ?? { stopIndex: startIndex, progress: 0 };
                    let { stopIndex, progress } = state;

                    if (stopIndex >= endIndex) {
                        completedBusIds.push(bus.id);
                        const finalStop = routeStops[endIndex];
                        return { ...location, latitude: finalStop.latitude, longitude: finalStop.longitude, timestamp: Date.now() };
                    }

                    const nextIndex = Math.min(stopIndex + 1, endIndex);
                    let startStop = routeStops[stopIndex];
                    let endStop = routeStops[nextIndex];
                    let reachedStop = false;

                    progress += BUS_PROGRESS_STEP;
                    if (progress >= 1) {
                        progress = 0;
                        stopIndex = nextIndex;
                        reachedStop = true;
                        startStop = routeStops[stopIndex];
                        endStop = routeStops[Math.min(stopIndex + 1, endIndex)] ?? startStop;

                        const studentStops = MOCK_STUDENTS
                            .filter(student => student.bus_id === bus.id)
                            .map(student => routeStops.findIndex(stop => stop.id === student.stop_id))
                            .filter(index => index >= 0);
                        if (studentStops.includes(stopIndex)) {
                            busPauseUntilRef.current[bus.id] = Date.now() + 5000;
                        }
                    }

                    busProgressRef.current[bus.id] = { stopIndex, progress };

                    const latitude = reachedStop ? startStop.latitude : startStop.latitude + (endStop.latitude - startStop.latitude) * progress;
                    const longitude = reachedStop ? startStop.longitude : startStop.longitude + (endStop.longitude - startStop.longitude) * progress;

                    return { ...location, latitude, longitude, timestamp: Date.now() };
                });
            });

            if (completedBusIds.length > 0) {
                setActiveTrips(prev => {
                    const nextState = { ...prev };
                    completedBusIds.forEach(busId => {
                        nextState[busId] = false;
                    });
                    return nextState;
                });

                completedBusIds.forEach(busId => {
                    if (tripCompletedRef.current[busId]) return;
                    const bus = MOCK_BUSES.find(b => b.id === busId);
                    if (!bus) return;
                    tripCompletedRef.current[busId] = true;
                    pushNotification({
                        title: 'Trip Completed',
                        message: `${bus.bus_number} has reached ${END_STOP_NAME}.`,
                        bus_id: bus.id,
                        target_roles: ['student', 'admin']
                    });
                });
            }
        }, BUS_TICK_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [activeTrips]);

    const themeValue = useMemo(() => ({ theme, setTheme }), [theme]);
    
    const authValue = useMemo(() => ({
        user,
        login: (email: string, password: string) => {
            if (password !== 'password123') {
                alert("Invalid credentials. Please use 'password123' for all accounts.");
                return;
            }
            const student = MOCK_STUDENTS.find(s => s.email.toLowerCase() === email.toLowerCase());
            if (student) {
                setUser(student);
                return;
            }
            const driver = MOCK_DRIVERS.find(d => d.email.toLowerCase() === email.toLowerCase());
            if (driver) {
                setUser(driver);
                return;
            }
            if (MOCK_ADMIN.email.toLowerCase() === email.toLowerCase()) {
                setUser(MOCK_ADMIN);
                return;
            }
            alert("User not found.");
        },
        logout: () => {
            setUser(null);
        },
        isTripActive: (busId: number) => Boolean(activeTrips[busId]),
        toggleTrip: (driverBusId: number) => {
            setActiveTrips(prev => {
                const isActive = Boolean(prev[driverBusId]);
                const nextState = { ...prev, [driverBusId]: !isActive };
                if (!isActive) {
                    const bus = MOCK_BUSES.find(b => b.id === driverBusId);
                    if (bus) {
                        const routeStops = MOCK_STOPS
                            .filter(s => s.route_id === bus.route_id)
                            .sort((a, b) => a.id - b.id);
                        const endIndexCandidate = routeStops.findIndex(stop => stop.stop_name === END_STOP_NAME);
                        const endIndex = endIndexCandidate >= 0 ? endIndexCandidate : routeStops.length - 1;

                        const studentStops = MOCK_STUDENTS
                            .filter(student => student.bus_id === bus.id)
                            .map(student => routeStops.findIndex(stop => stop.id === student.stop_id))
                            .filter(index => index >= 0);

                        const earliestStopIndex = studentStops.length > 0 ? Math.min(...studentStops) : 0;
                        const startIndex = Math.max(earliestStopIndex - 2, 0);
                        const safeStartIndex = startIndex >= endIndex ? Math.max(endIndex - 2, 0) : startIndex;

                        tripMetaRef.current[driverBusId] = { startIndex: safeStartIndex, endIndex };
                        busProgressRef.current[driverBusId] = { stopIndex: safeStartIndex, progress: 0 };
                        tripCompletedRef.current[driverBusId] = false;
                        busPauseUntilRef.current[driverBusId] = 0;

                        const ticksPerSegment = Math.ceil(1 / BUS_PROGRESS_STEP);
                        const segments = Math.max(endIndex - safeStartIndex, 1);
                        const durationMs = segments * ticksPerSegment * BUS_TICK_INTERVAL_MS;
                        setBusLoopDurations(prevDurations => ({ ...prevDurations, [driverBusId]: durationMs }));

                        const startStop = routeStops[safeStartIndex];
                        if (startStop) {
                            setBusLocations(prevLocations => prevLocations.map(location => (
                                location.bus_id === driverBusId
                                    ? { ...location, latitude: startStop.latitude, longitude: startStop.longitude, timestamp: Date.now() }
                                    : location
                            )));
                        }

                        const route = MOCK_ROUTES.find(r => r.id === bus.route_id);
                        const routeName = route?.route_name ?? 'its route';
                        pushNotification({
                            title: 'Trip Started',
                            message: `${bus.bus_number} has started its trip on ${routeName}.`,
                            bus_id: bus.id,
                            target_roles: ['student', 'admin']
                        });
                    }
                }
                return nextState;
            });
        },
        busLocations,
        busLoopDurations,
        notifications,
        addNotification: pushNotification
    }), [user, activeTrips, busLocations, busLoopDurations, notifications, pushNotification]);

    return (
        <ThemeContext.Provider value={themeValue}>
            <AuthContext.Provider value={authValue}>
                <HashRouter>
                    <Routes>
                        <Route path="/login" element={user ? <Navigate to={`/${user.role}`} /> : <LoginPage />} />
                        <Route path="/student/*" element={user?.role === 'student' ? <StudentLayout /> : <Navigate to="/login" />} />
                        <Route path="/driver/*" element={user?.role === 'driver' ? <DriverLayout /> : <Navigate to="/login" />} />
                        <Route path="/admin/*" element={user?.role === 'admin' ? <AdminLayout /> : <Navigate to="/login" />} />
                        <Route path="*" element={<Navigate to={user ? `/${user.role}` : "/login"} />} />
                    </Routes>
                </HashRouter>
            </AuthContext.Provider>
        </ThemeContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};

export default App;