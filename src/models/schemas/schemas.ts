
interface Table {
    id: number
}

interface Guest extends Table {
    first_name: string,
    last_name: string,
    age?: number,
    phone?: string,
    email: string,
    guest_password: string
}

interface Hotel extends Table {
    hotel_name: string,
		star_num: number,
		price_id: number,
		city: string,
		country_code: string,
		country: string,
		address: string,
		url: string,
		rating: string
}

export { Table, Guest, Hotel }