drop table if exists receptionists;
drop table if exists managers;
drop table if exists staff;
drop table if exists logs;
drop table if exists reservations;
drop table if exists guests;
drop table if exists rooms;
drop table if exists prices;
drop table if exists rooms_types;
drop table if exists hotels;


CREATE TABLE if not exists staff
(
	id SERIAL,
	sure_name VARCHAR(50) NOT NULL,
	first_name VARCHAR(50) NOT NULL,
	salary MONEY NOT NULL DEFAULT 1000,
	CONSTRAINT pk_staff PRIMARY KEY(id)
);

CREATE TABLE if not exists managers (
	phone VARCHAR(12),
	CONSTRAINT pk_managers PRIMARY KEY (id)
) INHERITS (staff);

CREATE TABLE if not exists hotels (
	id SERIAL,
	hotel_name VARCHAR NOT NULL,
	star_num NUMERIC(2,1),
	price_id INTEGER,
	city VARCHAR,
	country_code VARCHAR(2) NOT NULL,
	country VARCHAR NOT NULL,
	address VARCHAR,
	url VARCHAR,
	rating NUMERIC(3,1) CHECK(rating between 0 and 10),
	CONSTRAINT pk_hotels PRIMARY KEY(id)
);

CREATE TABLE if not exists receptionists (
	shift NUMERIC(1,0),
	hotel_id INTEGER,
	CONSTRAINT pk_receptionists PRIMARY KEY (id)
) INHERITS (staff);

CREATE TABLE if not exists rooms_types(
	id SERIAL,
	class_name VARCHAR(20),
	capacity NUMERIC(1,0),
	bed_num NUMERIC(1,0),
	CONSTRAINT pk_rooms_types PRIMARY KEY(id)
);

CREATE TABLE prices ( 
	hotel_id INTEGER REFERENCES hotels ON DELETE CASCADE,
	room_type_id INTEGER REFERENCES rooms_types ,
	coast MONEY NOT NULL,
	CONSTRAINT pk_prices PRIMARY KEY (hotel_id, room_type_id)
);

CREATE TABLE if not exists rooms(
	id SERIAL,
	num INTEGER NOT NULL CHECK(num > 0),
	hotel_id INTEGER REFERENCES hotels ON DELETE CASCADE,
	room_type INTEGER REFERENCES rooms_types ON DELETE RESTRICT,
	CONSTRAINT pk_rooms PRIMARY KEY(id)
);

CREATE TABLE if not exists guests (
	id SERIAL,
	first_name character varying NOT NULL,
	last_name character varying NOT NULL,
	age numeric(3,0),
	phone character varying,
	email character varying UNIQUE NOT NULL,
	guest_password character varying NOT NULL,
	CONSTRAINT pk_guests PRIMARY KEY(id)
);

CREATE TABLE if not exists reservations (
	id SERIAL,
	guest_id INTEGER NOT NULL REFERENCES guests ON DELETE CASCADE,
	room_id INTEGER NOT NULL REFERENCES rooms ON DELETE CASCADE,
	reserve_time TIMESTAMP NOT NULL,
	reserve_status VARCHAR(20),
	arrival_date DATE NOT NULL,
	departure_date DATE NOT NULL CHECK (departure_date >= arrival_date),
	CONSTRAINT pk_reservations PRIMARY KEY(id)
);

CREATE TABLE if not exists logs (
	id SERIAL,
	guest_id INTEGER NOT NULL REFERENCES guests ON DELETE RESTRICT,
	room_id INTEGER NOT NULL REFERENCES rooms ON DELETE RESTRICT,
	log_time TIMESTAMP NOT NULL,
	reserve_time TIMESTAMP NOT NULL,
	log_status varchar(20),
	arrival_date DATE NOT NULL,
	departure_date DATE NOT NULL,
	CONSTRAINT pk_logs PRIMARY KEY(id)
);
