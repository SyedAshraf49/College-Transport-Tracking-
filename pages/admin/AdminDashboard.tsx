
import React from 'react';
import Card from '../../components/Card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { MOCK_BUSES } from '../../constants';

const onTimeData = [
    { name: 'Mon', onTime: 95, delayed: 5 },
    { name: 'Tue', onTime: 98, delayed: 2 },
    { name: 'Wed', onTime: 92, delayed: 8 },
    { name: 'Thu', onTime: 97, delayed: 3 },
    { name: 'Fri', onTime: 99, delayed: 1 },
];

const usageData = [
    { name: 'Route A', value: 400 },
    { name: 'Route B', value: 300 },
];
const COLORS = ['#3b82f6', '#ef4444'];

const AdminDashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Buses</h3>
                    <p className="text-4xl font-bold text-primary-500">2</p>
                </Card>
                <Card className="text-center">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Drivers</h3>
                    <p className="text-4xl font-bold text-green-500">2</p>
                </Card>
                <Card className="text-center">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Students</h3>
                    <p className="text-4xl font-bold text-yellow-500">2</p>
                </Card>
                <Card className="text-center">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Routes Active</h3>
                    <p className="text-4xl font-bold text-red-500">2</p>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-xl font-bold mb-4">On-Time Performance (%)</h2>
                    <div className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={onTimeData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }} />
                                <Legend />
                                <Bar dataKey="onTime" stackId="a" fill="#2563eb" />
                                <Bar dataKey="delayed" stackId="a" fill="#ef4444" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card>
                    <h2 className="text-xl font-bold mb-4">Bus Usage Statistics</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={usageData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                    {usageData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
        </div>
    );
};

export default AdminDashboard;