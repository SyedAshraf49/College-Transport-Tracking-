
import React, { useState } from 'react';
import { useAuth } from '../../App';
import { Admin } from '../../types';
import AdminDashboard from './AdminDashboard';
import ManageData from './ManageData';
import LiveMapOverview from './LiveMapOverview';
import ThemeToggle from '../../components/ThemeToggle';
import { ChartBarIcon, UsersIcon, MapIcon, LogoutIcon, BusIcon } from '../../components/icons';

type AdminView = 'dashboard' | 'manage' | 'map';

const AdminLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const admin = user as Admin;
    const [activeView, setActiveView] = useState<AdminView>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard':
                return <AdminDashboard />;
            case 'manage':
                return <ManageData />;
            case 'map':
                return <LiveMapOverview />;
            default:
                return <AdminDashboard />;
        }
    };
    
    return (
        <div className="min-h-screen flex text-gray-900 dark:text-gray-100 relative">
            {/* Desktop Sidebar */}
            <aside className={`hidden md:flex bg-white/20 dark:bg-black/20 backdrop-blur-lg shadow-xl transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex-col border-r border-white/20`}>
                 <div className="flex items-center justify-center h-20 border-b border-white/20">
                    <BusIcon className="h-8 w-8 text-primary-500" />
                    {isSidebarOpen && <span className="ml-3 text-xl font-bold">Tracker Admin</span>}
                </div>
                <nav className="flex-grow p-4 space-y-2">
                    <AdminNavItem icon={<ChartBarIcon className="h-6 w-6" />} label="Dashboard" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} isSidebarOpen={isSidebarOpen} />
                    <AdminNavItem icon={<UsersIcon className="h-6 w-6" />} label="Manage Data" active={activeView === 'manage'} onClick={() => setActiveView('manage')} isSidebarOpen={isSidebarOpen} />
                    <AdminNavItem icon={<MapIcon className="h-6 w-6" />} label="Live Map" active={activeView === 'map'} onClick={() => setActiveView('map')} isSidebarOpen={isSidebarOpen} />
                </nav>
                 <div className="p-4 border-t border-white/20">
                    <AdminNavItem icon={<LogoutIcon className="h-6 w-6" />} label="Logout" active={false} onClick={logout} isSidebarOpen={isSidebarOpen} />
                </div>
            </aside>

            {/* Mobile menu backdrop */}
            {isMobileMenuOpen && (
                <button
                    className="md:hidden fixed inset-0 bg-black/50 z-30"
                    aria-label="Close menu"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar Drawer */}
            <aside className={`md:hidden fixed top-0 left-0 h-full w-72 max-w-[85vw] z-40 bg-white/80 dark:bg-black/70 backdrop-blur-lg shadow-xl border-r border-white/20 transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between h-16 px-4 border-b border-white/20">
                    <div className="flex items-center">
                        <BusIcon className="h-7 w-7 text-primary-500" />
                        <span className="ml-2 text-lg font-bold">Tracker Admin</span>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 rounded-md hover:bg-white/20 dark:hover:bg-black/20"
                        aria-label="Close menu"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <nav className="p-4 space-y-2">
                    <AdminNavItem icon={<ChartBarIcon className="h-6 w-6" />} label="Dashboard" active={activeView === 'dashboard'} onClick={() => { setActiveView('dashboard'); setIsMobileMenuOpen(false); }} isSidebarOpen={true} />
                    <AdminNavItem icon={<UsersIcon className="h-6 w-6" />} label="Manage Data" active={activeView === 'manage'} onClick={() => { setActiveView('manage'); setIsMobileMenuOpen(false); }} isSidebarOpen={true} />
                    <AdminNavItem icon={<MapIcon className="h-6 w-6" />} label="Live Map" active={activeView === 'map'} onClick={() => { setActiveView('map'); setIsMobileMenuOpen(false); }} isSidebarOpen={true} />
                </nav>
                <div className="p-4 border-t border-white/20 mt-auto">
                    <AdminNavItem icon={<LogoutIcon className="h-6 w-6" />} label="Logout" active={false} onClick={logout} isSidebarOpen={true} />
                </div>
            </aside>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                <header className="bg-white/20 dark:bg-black/20 backdrop-blur-lg shadow-lg p-3 sm:p-4 flex justify-between items-center border-b border-white/20">
                    <button onClick={() => { if (window.innerWidth < 768) { setIsMobileMenuOpen(true); return; } setIsSidebarOpen(!isSidebarOpen); }} className="p-2 rounded-md hover:bg-white/20 dark:hover:bg-black/20">
                        {/* Hamburger Icon */}
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="flex items-center gap-4">
                        <span className="font-semibold hidden sm:block">Welcome, {admin.name}</span>
                        <ThemeToggle />
                    </div>
                </header>
                <main className="flex-1 p-3 sm:p-6 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

const AdminNavItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void, isSidebarOpen: boolean }> = ({ icon, label, active, onClick, isSidebarOpen }) => (
    <button onClick={onClick} className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${active ? 'bg-primary-500/80 text-white shadow-lg' : 'hover:bg-white/20 dark:hover:bg-black/20'}`}>
        {icon}
        {isSidebarOpen && <span className="ml-4 font-medium">{label}</span>}
    </button>
);


export default AdminLayout;