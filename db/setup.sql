DROP table if exists logs;
DROP table if exists reservations;
DROP table if exists rooms;
drop table if exists prices;
drop table if exists rooms_types;
drop table if exists owners_hotels;
drop table if exists owners;
drop table if exists managers;
drop table if exists staff;
drop table if exists hotels;
drop table if exists accounts;
drop table if exists users;
CREATE TABLE if not exists users (
	id SERIAL,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	CONSTRAINT pk_users PRIMARY KEY (id)
);

CREATE TABLE if not exists accounts (
	login_name VARCHAR(50) UNIQUE NOT NULL ,
	email VARCHAR(50) CONSTRAINT email_must_unique UNIQUE NOT NULL,
	account_password VARCHAR(30) NOT NULL,
	CONSTRAINT pk_accounts PRIMARY KEY (id)
) INHERITS (users);


CREATE TABLE if not exists hotels (
	id SERIAL,
	hotel_name VARCHAR NOT NULL,
	star_num NUMERIC(2,1) CHECK (star_num between 0 and 5),
	city VARCHAR,
	country_code VARCHAR(2) NOT NULL,
	country VARCHAR NOT NULL,
	address VARCHAR,
	url VARCHAR,
	rating NUMERIC(3,1) CHECK(rating between 0 and 10),
	budget MONEY,
	CONSTRAINT pk_hotels PRIMARY KEY(id)
);

CREATE TABLE if not exists staff(
	hotel_id INTEGER REFERENCES hotels,
	salary MONEY NOT NULL DEFAULT 1000,
	CONSTRAINT pk_staff PRIMARY KEY(id)
) INHERITS (users);


CREATE TABLE if not exists managers (
	phone_number VARCHAR(12),
	CONSTRAINT pk_managers PRIMARY KEY (id)
) INHERITS (staff, accounts);

CREATE TABLE if not exists owners (
	CONSTRAINT pk_owners PRIMARY KEY(id)
) INHERITS (accounts);

CREATE TABLE if not exists owners_hotels (
	hotel_id INTEGER REFERENCES hotels,
	owner_id INTEGER REFERENCES owners,
	CONSTRAINT pk_owners_hotels PRIMARY KEY(hotel_id, owner_id)
);

CREATE TABLE if not exists rooms_types(
	id SERIAL,
	class_name VARCHAR(20),
	capacity NUMERIC(1,0),
	bed_num NUMERIC(1,0),
	CONSTRAINT pk_rooms_types PRIMARY KEY(id)
);

CREATE TABLE if not exists prices ( 
	hotel_id INTEGER REFERENCES hotels ON DELETE CASCADE,
	room_type_id INTEGER REFERENCES rooms_types ON DELETE RESTRICT,
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

CREATE TABLE if not exists reservations (
	id SERIAL,
	guest_id INTEGER NOT NULL REFERENCES accounts ON DELETE CASCADE,
	room_id INTEGER NOT NULL REFERENCES rooms ON DELETE RESTRICT,
	reserve_time TIMESTAMP NOT NULL,
	reserve_status VARCHAR(20),
	arrival_date DATE NOT NULL,
	departure_date DATE NOT NULL,
	CONSTRAINT pk_reservations PRIMARY KEY(id),
	CHECK (departure_date >= arrival_date)
);

CREATE TABLE if not exists logs (
	id SERIAL,
	guest_id INTEGER NOT NULL REFERENCES accounts ON DELETE NO ACTION,
	room_id INTEGER NOT NULL REFERENCES rooms ON DELETE NO ACTION,
	log_time TIMESTAMP NOT NULL,
	reserve_time TIMESTAMP NOT NULL,
	log_status varchar(20),
	arrival_date DATE NOT NULL,
	departure_date DATE NOT NULL,
	CONSTRAINT pk_logs PRIMARY KEY(id)
);
