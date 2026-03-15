
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
        <div className="min-h-screen flex text-gray-900 dark:text-gray-100">
            {/* Sidebar */}
            <aside className={`bg-white/20 dark:bg-black/20 backdrop-blur-lg shadow-xl transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col border-r border-white/20`}>
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
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                <header className="bg-white/20 dark:bg-black/20 backdrop-blur-lg shadow-lg p-4 flex justify-between items-center border-b border-white/20">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md hover:bg-white/20 dark:hover:bg-black/20">
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
                <main className="flex-1 p-6 overflow-y-auto">
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