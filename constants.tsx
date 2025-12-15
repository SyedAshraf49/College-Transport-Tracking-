
import { Student, Driver, Admin, Bus, Route, Stop, Notification, Attendance } from './types';

export const MOCK_ADMIN: Admin = {
    id: 301,
    name: "Admin User",
    email: "admin@example.com",
    role: 'admin',
};

export const MOCK_ROUTES: Route[] = [
    { id: 1, route_name: "Velachery Route", start_point: "Velachery", end_point: "College Campus" },
    { id: 2, route_name: "Adyar Route", start_point: "Adyar", end_point: "College Campus" },
    { id: 3, route_name: "Royapuram Route", start_point: "Royapuram", end_point: "College Campus" },
    { id: 4, route_name: "T. Nagar Route", start_point: "T. Nagar", end_point: "College Campus" },
    { id: 5, route_name: "Saidapet Route", start_point: "Saidapet", end_point: "College Campus" },
    { id: 6, route_name: "Ashok Nagar Route", start_point: "Ashok Nagar", end_point: "College Campus" },
    { id: 7, route_name: "Kasimedu Route", start_point: "Kasimedu", end_point: "College Campus" },
];

export const MOCK_STOPS: Stop[] = [
    // Route 1: Velachery Route
    { id: 1, stop_name: "Velachery", latitude: 10, longitude: 15, route_id: 1 },
    { id: 2, stop_name: "Guindy", latitude: 30, longitude: 35, route_id: 1 },
    { id: 3, stop_name: "Ekkattuthangal", latitude: 55, longitude: 50, route_id: 1 },
    { id: 4, stop_name: "Vadapalani", latitude: 70, longitude: 75, route_id: 1 },
    { id: 5, stop_name: "College Gate", latitude: 90, longitude: 90, route_id: 1 },

    // Route 2: Adyar Route
    { id: 6, stop_name: "Adyar", latitude: 15, longitude: 85, route_id: 2 },
    { id: 7, stop_name: "Kotturpuram", latitude: 40, longitude: 70, route_id: 2 },
    { id: 8, stop_name: "Teynampet", latitude: 65, longitude: 60, route_id: 2 },
    { id: 9, stop_name: "College Gate", latitude: 90, longitude: 90, route_id: 2 },

    // Route 3: Royapuram Route
    { id: 10, stop_name: "Royapuram", latitude: 15, longitude: 25, route_id: 3 },
    { id: 11, stop_name: "Parrys Corner", latitude: 40, longitude: 45, route_id: 3 },
    { id: 12, stop_name: "College Gate", latitude: 90, longitude: 90, route_id: 3 },

    // Route 4: T. Nagar Route
    { id: 13, stop_name: "T. Nagar", latitude: 25, longitude: 50, route_id: 4 },
    { id: 14, stop_name: "Nungambakkam", latitude: 50, longitude: 65, route_id: 4 },
    { id: 15, stop_name: "College Gate", latitude: 90, longitude: 90, route_id: 4 },

    // Route 5: Saidapet Route
    { id: 16, stop_name: "Saidapet", latitude: 45, longitude: 30, route_id: 5 },
    { id: 17, stop_name: "West Mambalam", latitude: 65, longitude: 55, route_id: 5 },
    { id: 18, stop_name: "College Gate", latitude: 90, longitude: 90, route_id: 5 },

    // Route 6: Ashok Nagar Route
    { id: 19, stop_name: "Ashok Nagar", latitude: 60, longitude: 20, route_id: 6 },
    { id: 20, stop_name: "K.K. Nagar", latitude: 75, longitude: 40, route_id: 6 },
    { id: 21, stop_name: "College Gate", latitude: 90, longitude: 90, route_id: 6 },
    
    // Route 7: Kasimedu Route
    { id: 22, stop_name: "Kasimedu", latitude: 75, longitude: 45, route_id: 7 },
    { id: 23, stop_name: "Washermenpet", latitude: 80, longitude: 65, route_id: 7 },
    { id: 24, stop_name: "College Gate", latitude: 90, longitude: 90, route_id: 7 },
];


export const MOCK_STUDENTS: Student[] = [
    { id: 101, name: "Anbu Selvan", email: "anbu@example.com", role: 'student', roll_no: "S12345", stop_id: 3, bus_id: 1 },
    { id: 102, name: "Priya Murugan", email: "priya.m@example.com", role: 'student', roll_no: "S67890", stop_id: 4, bus_id: 1 },
    { id: 103, name: "Karthik Raja", email: "karthik@example.com", role: 'student', roll_no: "S11111", stop_id: 10, bus_id: 3 },
    { id: 104, name: "Divya Lakshmi", email: "divya@example.com", role: 'student', roll_no: "S22222", stop_id: 13, bus_id: 4 },
    { id: 105, name: "Suresh Kumar", email: "suresh@example.com", role: 'student', roll_no: "S33333", stop_id: 16, bus_id: 5 },
    { id: 106, name: "Meena Sundaram", email: "meena@example.com", role: 'student', roll_no: "S44444", stop_id: 19, bus_id: 6 },
    { id: 107, name: "Arun Pandian", email: "arun@example.com", role: 'student', roll_no: "S55555", stop_id: 22, bus_id: 7 },
];

export const MOCK_DRIVERS: Driver[] = [
    { id: 201, name: "Murugan P", email: "murugan@example.com", role: 'driver', phone: "123-456-7890", license_number: "DLX9876" },
    { id: 202, name: "Velu S", email: "velu@example.com", role: 'driver', phone: "098-765-4321", license_number: "DLY5432" },
    { id: 203, name: "Kannan R", email: "kannan@example.com", role: 'driver', phone: "111-222-3333", license_number: "DLX1111" },
    { id: 204, name: "Saravanan G", email: "saravanan@example.com", role: 'driver', phone: "222-333-4444", license_number: "DLX2222" },
    { id: 205, name: "Lakshmi M", email: "lakshmi@example.com", role: 'driver', phone: "333-444-5555", license_number: "DLX3333" },
    { id: 206, name: "Muthu Kumar", email: "muthu@example.com", role: 'driver', phone: "444-555-6666", license_number: "DLX4444" },
    { id: 207, name: "Rajeshwari K", email: "rajeshwari@example.com", role: 'driver', phone: "555-666-7777", license_number: "DLX5555" },
];


export const MOCK_BUSES: Bus[] = [
    { id: 1, bus_number: "BUS-001", driver_id: 201, route_id: 1, capacity: 50, occupancy: 35 },
    { id: 2, bus_number: "BUS-002", driver_id: 202, route_id: 2, capacity: 50, occupancy: 42 },
    { id: 3, bus_number: "BUS-003", driver_id: 203, route_id: 3, capacity: 50, occupancy: 25 },
    { id: 4, bus_number: "BUS-004", driver_id: 204, route_id: 4, capacity: 50, occupancy: 30 },
    { id: 5, bus_number: "BUS-005", driver_id: 205, route_id: 5, capacity: 50, occupancy: 45 },
    { id: 6, bus_number: "BUS-006", driver_id: 206, route_id: 6, capacity: 50, occupancy: 15 },
    { id: 7, bus_number: "BUS-007", driver_id: 207, route_id: 7, capacity: 50, occupancy: 38 },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 1, title: "Bus Delay", message: "Bus-001 is running 15 minutes late due to traffic.", date: "2024-07-29", bus_id: 1 },
    { id: 2, title: "Route Change", message: "Route A will have a detour tomorrow near City Park.", date: "2024-07-28" },
    { id: 3, title: "Holiday Schedule", message: "Buses will operate on a holiday schedule next Monday.", date: "2024-07-27" },
];

export const MOCK_ATTENDANCE: Attendance[] = [
    { id: 1, student_id: 101, bus_id: 1, date: "2024-07-29", time: "08:15 AM", qr_verified: true },
    { id: 2, student_id: 102, bus_id: 1, date: "2024-07-29", time: "08:25 AM", qr_verified: true },
];

export const MOCK_BUS_LOCATIONS = MOCK_BUSES.map(bus => {
    const routeStops = MOCK_STOPS.filter(s => s.route_id === bus.route_id);
    const firstStop = routeStops.length > 0 ? routeStops[0] : { latitude: 50, longitude: 50 };
    return {
        bus_id: bus.id,
        latitude: firstStop.latitude,
        longitude: firstStop.longitude,
        timestamp: Date.now()
    };
});