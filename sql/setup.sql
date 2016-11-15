drop table if exists receptionists;
drop table if exists managers;
drop table if exists stuff;
drop table if exists logs;
drop table if exists reservations;
drop table if exists guests;
drop table if exists rooms;
drop table if exists prices;
drop table if exists rooms_types;
drop table if exists hotels;

CREATE TABLE if not exists stuff
(
	id SERIAL NOT NULL,
	sure_name VARCHAR(50) NOT NULL,
	first_name VARCHAR(50) NOT NULL,
	salary MONEY NOT NULL DEFAULT 1000,
	CONSTRAINT pk_staff PRIMARY KEY(id)
);

CREATE TABLE if not exists managers (
	phone VARCHAR(12),
	CONSTRAINT pk_manager PRIMARY KEY (id)
) INHERITS (stuff);

CREATE TABLE if not exists hotels (
	id INTEGER PRIMARY KEY,
	hotel_name VARCHAR NOT NULL,
	stars NUMERIC(2,1),
	price_id INTEGER,
	city VARCHAR,
	country_code VARCHAR(2) NOT NULL,
	country VARCHAR NOT NULL,
	address VARCHAR,
	url VARCHAR,
	rating NUMERIC(3,1) CHECK(rating between 0 and 10)
);

CREATE TABLE if not exists receptionists (
	shift NUMERIC(1,0),
	hotel_id INTEGER,
	CONSTRAINT pk_receptionist PRIMARY KEY (id)
) INHERITS (stuff);

CREATE TABLE if not exists rooms_types(
	id SERIAL PRIMARY KEY,
	class_name VARCHAR(20),
	capacity NUMERIC(1,0),
	bed_quantity NUMERIC(1,0)
);

CREATE TABLE prices ( 
	hotel_id INTEGER REFERENCES hotels ON DELETE CASCADE,
	room_type_id INTEGER REFERENCES rooms_types ,
	coast MONEY NOT NULL,
	CONSTRAINT pk_price PRIMARY KEY (hotel_id, room_type_id)
);

CREATE TABLE if not exists rooms(
	id SERIAL PRIMARY KEY,
	num INTEGER NOT NULL CHECK(num > 0),
	hotel_id INTEGER REFERENCES hotels ON DELETE CASCADE,
	room_type INTEGER REFERENCES rooms_types ON DELETE RESTRICT
);

CREATE TABLE if not exists guests (
	id SERIAL PRIMARY KEY,
	sure_name VARCHAR NOT NULL,
	last_name VARCHAR NOT NULL,
	age NUMERIC(3) NOT NULL,
	phone VARCHAR,
	email VARCHAR NOT NULL,
	guest_password VARCHAR
);

CREATE TABLE if not exists reservations (
	id SERIAL PRIMARY KEY,
	guest_id INTEGER NOT NULL REFERENCES guests ON DELETE CASCADE,
	room_id INTEGER NOT NULL REFERENCES rooms ON DELETE CASCADE,
	reserve_time TIMESTAMP NOT NULL,
	reserve_status VARCHAR(20),
	arrival_date DATE NOT NULL,
	departure_date DATE NOT NULL CHECK (departure_date >= arrival_date)
);

CREATE TABLE if not exists logs (
	id SERIAL PRIMARY KEY,
	guest_id INTEGER NOT NULL REFERENCES guests ON DELETE RESTRICT,
	room_id INTEGER NOT NULL REFERENCES rooms ON DELETE RESTRICT,
	log_time TIMESTAMP NOT NULL,
	reserve_time TIMESTAMP NOT NULL,
	log_status varchar(20),
	arrival_date DATE NOT NULL,
	departure_date DATE NOT NULL
);

