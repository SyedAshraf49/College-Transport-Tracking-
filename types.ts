
export type UserRole = 'student' | 'driver' | 'admin';

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
}

export interface Student extends User {
    role: 'student';
    roll_no: string;
    stop_id: number;
    bus_id: number;
}

export interface Driver extends User {
    role: 'driver';
    phone: string;
    license_number: string;
}

export interface Admin extends User {
    role: 'admin';
}

export interface Bus {
    id: number;
    bus_number: string;
    driver_id: number;
    route_id: number;
    capacity: number;
    occupancy: number;
}

export interface Route {
    id: number;
    route_name: string;
    start_point: string;
    end_point: string;
}

export interface Stop {
    id: number;
    stop_name: string;
    latitude: number;
    longitude: number;
    route_id: number;
}

export interface BusLocation {
    bus_id: number;
    latitude: number;
    longitude: number;
    timestamp: number;
}

export interface Notification {
    id: number;
    title: string;
    message: string;
    date: string;
    bus_id?: number;
    stop_id?: number;
    target_roles: UserRole[];
}

export interface Attendance {
    id: number;
    student_id: number;
    bus_id: number;
    date: string;
    time: string;
    qr_verified: boolean;
}