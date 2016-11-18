﻿DROP table if exists logs;
DROP table if exists reservations;
DROP table if exists rooms;
drop table if exists prices;
drop table if exists room_types;
drop table if exists owners_hotels;
drop table if exists owners;
drop table if exists managers;
drop table if exists staff;
drop table if exists hotels;
drop table if exists guests;
drop table if exists users;
drop table if exists people;

CREATE TABLE IF NOT EXISTS people (
	id SERIAL,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	date_of_birth DATE,
	phone VARCHAR(12),
	CONSTRAINT pk_people PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS users (
	username VARCHAR(50) UNIQUE NOT NULL ,
	email VARCHAR(50) CONSTRAINT email_must_unique UNIQUE NOT NULL,
	user_password VARCHAR(60) NOT NULL,
	CONSTRAINT pk_users PRIMARY KEY (id)
) INHERITS (people);

CREATE TABLE IF NOT EXISTS guests (
	payments VARCHAR,
	CONSTRAINT pk_guests PRIMARY KEY (id)
) INHERITS (users);


CREATE TABLE IF NOT EXISTS hotels (
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

CREATE TABLE IF NOT EXISTS staff (
	hotel_id INTEGER REFERENCES hotels,
	salary MONEY NOT NULL DEFAULT 1000,
	CONSTRAINT pk_staff PRIMARY KEY(id)
) INHERITS (people);


CREATE TABLE IF NOT EXISTS managers (
	CONSTRAINT pk_managers PRIMARY KEY (id)
) INHERITS (staff, users);

CREATE TABLE IF NOT EXISTS owners (
	CONSTRAINT pk_owners PRIMARY KEY(id)
) INHERITS (users);

CREATE TABLE IF NOT EXISTS hotel_owners (
	hotel_id INTEGER REFERENCES hotels,
	owner_id INTEGER REFERENCES owners,
	CONSTRAINT pk_owners_hotels PRIMARY KEY(hotel_id, owner_id)
);

CREATE TABLE IF NOT EXISTS room_types (
	id SERIAL,
	class_name VARCHAR(20),
	capacity NUMERIC(1,0),
	bed_num NUMERIC(1,0),
	CONSTRAINT pk_room_types PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS price ( 
	hotel_id INTEGER REFERENCES hotels ON DELETE CASCADE,
	room_type_id INTEGER REFERENCES room_types ON DELETE RESTRICT,
	cost MONEY NOT NULL,
	CONSTRAINT pk_prices PRIMARY KEY (hotel_id, room_type_id)
);

CREATE TABLE IF NOT EXISTS rooms (
	id SERIAL,
	num INTEGER NOT NULL CHECK(num > 0),
	hotel_id INTEGER REFERENCES hotels ON DELETE CASCADE,
	room_type INTEGER REFERENCES room_types ON DELETE RESTRICT,
	floor NUMERIC(3,0),
	CONSTRAINT pk_rooms PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS reservations (
	id SERIAL,
	guest_id INTEGER NOT NULL REFERENCES guests ON DELETE CASCADE,
	room_id INTEGER NOT NULL REFERENCES rooms ON DELETE RESTRICT,
	reservation_time TIMESTAMP NOT NULL,
	reservation_status VARCHAR(20),
	arrival_date DATE NOT NULL,
	departure_date DATE NOT NULL,
	CONSTRAINT pk_reservations PRIMARY KEY(id),
	CONSTRAINT correct_dates CHECK (departure_date > arrival_date AND arrival_date > CURRENT_DATE)
);

CREATE TABLE IF NOT EXISTS logs (
	id SERIAL,
	guest_id INTEGER NOT NULL REFERENCES guests ON DELETE NO ACTION,
	room_id INTEGER NOT NULL REFERENCES rooms ON DELETE NO ACTION,
	log_time TIMESTAMP NOT NULL,
	reservation_time TIMESTAMP NOT NULL,
	log_status varchar(20),
	arrival_date DATE NOT NULL,
	departure_date DATE NOT NULL,
	CONSTRAINT pk_logs PRIMARY KEY(id)
);

CREATE VIEW all_hotels AS
	SELECT hotel_name, star_num, city, country, address, url, rating
	FROM hotels;


CREATE OR REPLACE VIEW the_best_hotels AS
	SELECT hotel_name, star_num, city, country, address, url, rating
	FROM hotels
	ORDER BY star_num desc, rating desc;

CREATE OR REPLACE VIEW hotels_price AS 
	SELECT h.hotel_name, h.star_num, rt.class_name as type, ps.cost
	from room_types as rt, 
	     hotels as h, 
             price as ps
	where 
	      ps.hotel_id = h.id and
	      ps.room_type_id= rt.id
	order by star_num desc;

CREATE OR REPLACE VIEW all_rooms AS 
	SELECT  h.hotel_name, h.star_num, r.num, rt.class_name as room_type,r.floor, rt.capacity, rt.bed_num, ps.cost
	from room_types as rt, 
	     hotels as h, 
             price as ps,
             rooms as r
	where 
	      ps.hotel_id = h.id and
	      ps.room_type_id= rt.id and
	      r.hotel_id = h.id and
	      rt.id = r.room_type
	order by star_num desc, rt.id asc;

CREATE OR REPLACE VIEW all_users AS 
	SELECT first_name, last_name, date_of_birth, phone, username, email, user_password
	from users;
	