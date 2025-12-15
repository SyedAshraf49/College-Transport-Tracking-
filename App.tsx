
import React, { useState, useMemo, createContext, useContext, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, BusLocation } from './types';
import { MOCK_STUDENTS, MOCK_DRIVERS, MOCK_ADMIN, MOCK_BUSES, MOCK_STOPS, MOCK_BUS_LOCATIONS } from './constants';
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
    isTripActive: boolean;
    toggleTrip: (driverBusId: number) => void;
    busLocations: BusLocation[];
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const App: React.FC = () => {
    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
    const [user, setUser] = useState<User | null>(null);
    const [isTripActive, setIsTripActive] = useState(false);
    const [busLocations, setBusLocations] = useState<BusLocation[]>(MOCK_BUS_LOCATIONS);
    const activeBusId = useRef<number | null>(null);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        if (!isTripActive || activeBusId.current === null) return;
        
        const bus = MOCK_BUSES.find(b => b.id === activeBusId.current);
        if (!bus) return;
        
        const routeStops = MOCK_STOPS.filter(s => s.route_id === bus.route_id).sort((a, b) => a.id - b.id);
        if (routeStops.length < 2) return;

        let currentStopIndex = 0;
        let progress = 0;
        
        const interval = setInterval(() => {
            const startStop = routeStops[currentStopIndex];
            const endStop = routeStops[(currentStopIndex + 1) % routeStops.length];

            progress += 0.05; // speed

            const lat = startStop.latitude + (endStop.latitude - startStop.latitude) * progress;
            const lon = startStop.longitude + (endStop.longitude - startStop.longitude) * progress;
            
            setBusLocations(prev => {
                const newLocations = [...prev];
                const busIndex = newLocations.findIndex(l => l.bus_id === activeBusId.current);
                if (busIndex !== -1) {
                    newLocations[busIndex] = { ...newLocations[busIndex], latitude: lat, longitude: lon, timestamp: Date.now() };
                }
                return newLocations;
            });

            if (progress >= 1) {
                progress = 0;
                currentStopIndex = (currentStopIndex + 1) % routeStops.length;
            }
        }, 500); // update interval

        return () => clearInterval(interval);

    }, [isTripActive]);

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
            setIsTripActive(false);
            activeBusId.current = null;
        },
        isTripActive,
        toggleTrip: (driverBusId: number) => {
            setIsTripActive(prev => {
                const nextState = !prev;
                if (nextState) {
                    activeBusId.current = driverBusId;
                } else {
                    activeBusId.current = null;
                }
                return nextState;
            });
        },
        busLocations
    }), [user, isTripActive, busLocations]);

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