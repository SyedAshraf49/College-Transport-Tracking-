
import React, { useState } from 'react';
import Card from '../../components/Card';
import { MOCK_BUSES, MOCK_DRIVERS, MOCK_ROUTES, MOCK_STUDENTS, MOCK_ATTENDANCE } from '../../constants';
import { Bus, Driver, Route, Student, Attendance } from '../../types';

type Tab = 'buses' | 'drivers' | 'routes' | 'students' | 'attendance';

const ManageData: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('buses');

    const renderContent = () => {
        switch (activeTab) {
            case 'buses':
                return <BusTable data={MOCK_BUSES} />;
            case 'drivers':
                return <DriverTable data={MOCK_DRIVERS} />;
            case 'routes':
                return <RouteTable data={MOCK_ROUTES} />;
            case 'students':
                return <StudentTable data={MOCK_STUDENTS} />;
            case 'attendance':
                return <AttendanceTable data={MOCK_ATTENDANCE} />;
        }
    }

    return (
        <Card>
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">Manage Data</h1>
            <div className="border-b border-white/20 mb-4">
                <nav className="-mb-px flex gap-2 sm:gap-4 overflow-x-auto pb-1">
                    <TabButton label="Buses" active={activeTab === 'buses'} onClick={() => setActiveTab('buses')} />
                    <TabButton label="Drivers" active={activeTab === 'drivers'} onClick={() => setActiveTab('drivers')} />
                    <TabButton label="Routes" active={activeTab === 'routes'} onClick={() => setActiveTab('routes')} />
                    <TabButton label="Students" active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
                    <TabButton label="Attendance" active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} />
                </nav>
            </div>
            {renderContent()}
        </Card>
    );
};

const TabButton: React.FC<{label: string, active: boolean, onClick: () => void}> = ({label, active, onClick}) => (
    <button onClick={onClick} className={`py-3 px-3 sm:px-4 border-b-2 font-medium text-sm whitespace-nowrap shrink-0 transition-colors ${active ? 'border-primary-400 text-primary-500 dark:text-primary-300 bg-white/10 dark:bg-black/10 rounded-t-md' : 'border-transparent text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-300/50'}`}>
        {label}
    </button>
);

const TableWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/20">
            {children}
        </table>
    </div>
);

const BusTable: React.FC<{ data: Bus[] }> = ({ data }) => (
    <TableWrapper>
        <thead className="bg-transparent">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Bus Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Driver ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Route ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Occupancy</th>
            </tr>
        </thead>
        <tbody className="bg-transparent divide-y divide-white/20">
            {data.map(bus => (
                <tr key={bus.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{bus.bus_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{bus.driver_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{bus.route_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{bus.occupancy} / {bus.capacity}</td>
                </tr>
            ))}
        </tbody>
    </TableWrapper>
);

const DriverTable: React.FC<{ data: Driver[] }> = ({ data }) => (
     <TableWrapper>
        <thead className="bg-transparent">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">License Number</th>
            </tr>
        </thead>
        <tbody className="bg-transparent divide-y divide-white/20">
            {data.map(driver => (
                <tr key={driver.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{driver.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{driver.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{driver.license_number}</td>
                </tr>
            ))}
        </tbody>
    </TableWrapper>
);

const RouteTable: React.FC<{ data: Route[] }> = ({ data }) => (
     <TableWrapper>
        <thead className="bg-transparent">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Route Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Start Point</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">End Point</th>
            </tr>
        </thead>
        <tbody className="bg-transparent divide-y divide-white/20">
            {data.map(route => (
                <tr key={route.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{route.route_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{route.start_point}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{route.end_point}</td>
                </tr>
            ))}
        </tbody>
    </TableWrapper>
);

const StudentTable: React.FC<{ data: Student[] }> = ({ data }) => (
    <TableWrapper>
       <thead className="bg-transparent">
           <tr>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Name</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Roll No</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Bus ID</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Stop ID</th>
           </tr>
       </thead>
       <tbody className="bg-transparent divide-y divide-white/20">
           {data.map(student => (
               <tr key={student.id}>
                   <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                   <td className="px-6 py-4 whitespace-nowrap">{student.roll_no}</td>
                   <td className="px-6 py-4 whitespace-nowrap">{student.bus_id}</td>
                   <td className="px-6 py-4 whitespace-nowrap">{student.stop_id}</td>
               </tr>
           ))}
       </tbody>
   </TableWrapper>
);

const AttendanceTable: React.FC<{ data: Attendance[] }> = ({ data }) => (
    <TableWrapper>
       <thead className="bg-transparent">
           <tr>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Student ID</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Bus ID</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Date & Time</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Verified</th>
           </tr>
       </thead>
       <tbody className="bg-transparent divide-y divide-white/20">
           {data.map(item => (
               <tr key={item.id}>
                   <td className="px-6 py-4 whitespace-nowrap">{item.student_id}</td>
                   <td className="px-6 py-4 whitespace-nowrap">{item.bus_id}</td>
                   <td className="px-6 py-4 whitespace-nowrap">{item.date} {item.time}</td>
                   <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.qr_verified ? 'bg-green-500/30 text-green-800 dark:text-green-200' : 'bg-red-500/30 text-red-800 dark:text-red-200'}`}>
                           {item.qr_verified ? 'Yes' : 'No'}
                       </span>
                   </td>
               </tr>
           ))}
       </tbody>
   </TableWrapper>
);

export default ManageData;