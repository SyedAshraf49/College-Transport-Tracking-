
import React from 'react';
import { useAuth } from '../../App';
import Card from '../../components/Card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { MOCK_BUSES, MOCK_DRIVERS, MOCK_ROUTES, MOCK_STUDENTS } from '../../constants';

const ROUTE_COLORS = ['#2563eb', '#0ea5e9', '#22c55e', '#f97316', '#8b5cf6', '#f43f5e', '#14b8a6'];

const AdminDashboard: React.FC = () => {
    const { notifications } = useAuth();
    const recentNotifications = notifications.filter(notif => notif.target_roles.includes('admin')).slice(0, 5);
    const totalBuses = MOCK_BUSES.length;
    const totalDrivers = MOCK_DRIVERS.length;
    const totalStudents = MOCK_STUDENTS.length;
    const routesActive = new Set(MOCK_BUSES.map(bus => bus.route_id)).size;

    const routeUsageData = React.useMemo(() => {
        return MOCK_ROUTES.map(route => {
            const busesOnRoute = MOCK_BUSES.filter(bus => bus.route_id === route.id);
            const studentsOnRoute = MOCK_STUDENTS.filter(student => {
                const bus = MOCK_BUSES.find(b => b.id === student.bus_id);
                return bus?.route_id === route.id;
            });
            return {
                name: route.route_name,
                buses: busesOnRoute.length,
                students: studentsOnRoute.length,
            };
        });
    }, []);

    const studentShareData = React.useMemo(() => {
        return MOCK_ROUTES.map(route => {
            const studentsOnRoute = MOCK_STUDENTS.filter(student => {
                const bus = MOCK_BUSES.find(b => b.id === student.bus_id);
                return bus?.route_id === route.id;
            });
            return {
                name: route.route_name,
                value: studentsOnRoute.length,
            };
        });
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Buses</h3>
                    <p className="text-4xl font-bold text-primary-500">{totalBuses}</p>
                </Card>
                <Card className="text-center">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Drivers</h3>
                    <p className="text-4xl font-bold text-green-500">{totalDrivers}</p>
                </Card>
                <Card className="text-center">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Students</h3>
                    <p className="text-4xl font-bold text-yellow-500">{totalStudents}</p>
                </Card>
                <Card className="text-center">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Routes Active</h3>
                    <p className="text-4xl font-bold text-red-500">{routesActive}</p>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-xl font-bold mb-4">Fleet Coverage by Route</h2>
                    <div className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={routeUsageData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }} />
                                <Legend />
                                <Bar dataKey="buses" name="Buses" fill="#2563eb" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="students" name="Students" fill="#10b981" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card>
                    <h2 className="text-xl font-bold mb-4">Student Distribution by Route</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={studentShareData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                    {studentShareData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={ROUTE_COLORS[index % ROUTE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}/>
                                 <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Live Bus Occupancy */}
            <Card>
                <h2 className="text-xl font-bold mb-4">Live Bus Occupancy</h2>
                <div className="space-y-4">
                    {MOCK_BUSES.map(bus => {
                        const percentage = (bus.occupancy / bus.capacity) * 100;
                        let progressBarColor = 'bg-green-500';
                        if (percentage > 75) {
                            progressBarColor = 'bg-yellow-500';
                        }
                        if (percentage >= 95) {
                            progressBarColor = 'bg-red-500';
                        }
                        return (
                            <div key={bus.id}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold">{bus.bus_number}</span>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{bus.occupancy} / {bus.capacity} Students</span>
                                </div>
                                <div className="w-full bg-black/20 rounded-full h-4">
                                    <div
                                        className={`${progressBarColor} h-4 rounded-full text-center text-white text-xs leading-4 transition-all duration-500`}
                                        style={{ width: `${percentage}%` }}
                                    >
                                        {percentage > 10 ? `${Math.round(percentage)}%` : ''}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            <Card>
                <h2 className="text-xl font-bold mb-4">Latest Alerts</h2>
                <div className="space-y-4">
                    {recentNotifications.length === 0 ? (
                        <div className="p-4 rounded-lg bg-black/10 dark:bg-white/10 border border-white/10 text-gray-700 dark:text-gray-300">
                            No alerts yet.
                        </div>
                    ) : (
                        recentNotifications.map(notif => {
                            const busNumber = notif.bus_id ? MOCK_BUSES.find(bus => bus.id === notif.bus_id)?.bus_number : null;
                            return (
                                <div key={notif.id} className="p-4 rounded-lg bg-black/10 dark:bg-white/10 border border-white/10">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-lg text-primary-700 dark:text-primary-300">{notif.title}</h3>
                                        <span className="text-xs text-gray-700 dark:text-gray-300">{notif.date}</span>
                                    </div>
                                    {busNumber && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Bus: {busNumber}</p>
                                    )}
                                    <p className="mt-1 text-gray-800 dark:text-gray-200">{notif.message}</p>
                                </div>
                            );
                        })
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AdminDashboard;