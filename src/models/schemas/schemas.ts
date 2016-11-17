export interface Table {
    id : number
}

export interface Person extends Table {
    first_name: string,
    last_name: string,
    age?: number,
    phone?: string
}

export interface Guest extends User {
    payment?: string;
}

export interface User extends Person {
    username?: string,
    email: string,
    user_password: string
}

export interface Staff extends Person {
    hotel_id: number,
    salary: number
}

export interface Manager extends Staff, User {
    phone_number?: string
}

export interface Hotel extends Table {
    hotel_name: string,
    star_num: string,
    city: string,
    country_code: string,
    country: string,
    address: string,
    url: string,
    rating: number,
    budget: number
}

export interface HotelOwner {
    hotel_id: number,
    owner_id: number
}

export interface RoomTypes extends Table {
    class_name: string,
    capacity: number,
    bed_num: number
}

export interface Price {
    hotel_id: number,
    room_type_id: number,
    cost: number
}

export interface Room extends Table {
    num: number,
    hotel_id: number,
    room_type: number
}

export interface Reservation extends Table {
    guest_id: number,
    room_id: number,
    reservation_time: string,
    reservation_status?: string,
    arrival_date: string,
    departure_date: string
}
    
export interface Log extends Table {
    guest_id: number,
    room_id: number,
    log_time: string,
    reservation_time: string,
    log_status?: string,
    arrival_date: string,
    departure_date: string
}