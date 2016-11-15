drop table IF EXISTS receptionists;
drop table IF EXISTS managers;
drop table IF EXISTS employees;
drop table IF EXISTS logs;
drop table IF EXISTS reservations;
drop table IF EXISTS guests;
drop table IF EXISTS rooms;
drop table IF EXISTS prices;
drop table IF EXISTS room_types;
drop table IF EXISTS hotels;

CREATE TABLE IF NOT EXISTS employees (
  id SERIAL NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  salary MONEY NOT NULL DEFAULT 1000,
  CONSTRAINT pk_employees PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS managers (
  phone VARCHAR(12),
  CONSTRAINT pk_managers PRIMARY KEY (id)
) INHERITS (employees);

CREATE TABLE IF NOT EXISTS hotels (
	id INTEGER PRIMARY KEY,
	name VARCHAR NOT NULL,
	star_num NUMERIC(2,1),
	price INTEGER,
	city VARCHAR,
	country_code VARCHAR(2) NOT NULL,
	country VARCHAR NOT NULL,
	address VARCHAR,
	url VARCHAR,
	rating NUMERIC(3,1) CHECK(rating between 0 and 10)
);

CREATE TABLE IF NOT EXISTS receptionists (
	  shift NUMERIC(1,0),
	  hotels_id INTEGER,
	  CONSTRAINT pk_receptionists PRIMARY KEY (id)
) INHERITS (employees);

CREATE TABLE IF NOT EXISTS room_types (
	id SERIAL PRIMARY KEY,
	class VARCHAR(20),
	capacity NUMERIC(1),
	bed_quantity NUMERIC(1)
);

CREATE TABLE prices ( 
	hotels_id INTEGER REFERENCES hotels ON DELETE CASCADE,
	type_id INTEGER REFERENCES room_types,
	coast MONEY,
	PRIMARY KEY (hotels_id, type_id)
);

CREATE TABLE IF NOT EXISTS rooms (
	id SERIAL PRIMARY KEY,
	num INTEGER NOT NULL CHECK(num > 0),
	hotels_id INTEGER REFERENCES hotels,
	type INTEGER REFERENCES room_types
);

CREATE TABLE IF NOT EXISTS guests (
	id SERIAL PRIMARY KEY,
	first_name VARCHAR NOT NULL,
	last_name VARCHAR NOT NULL,
	age NUMERIC(3),
	phone VARCHAR,
	email VARCHAR NOT NULL,
	password VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS reservations (
	id SERIAL PRIMARY KEY,
	guests_id INTEGER NOT NULL REFERENCES guests ON DELETE CASCADE,
	rooms_id INTEGER NOT NULL REFERENCES rooms ON DELETE CASCADE,
	reserve_time TIMESTAMP NOT NULL,
	status varchar(20),
	arrive DATE NOT NULL,
	departure DATE NOT NULL CHECK (departure >= arrive)
);

CREATE TABLE IF NOT EXISTS logs (
	id SERIAL PRIMARY KEY,
	guests_id INTEGER NOT NULL REFERENCES guests ON DELETE RESTRICT,
	rooms_id INTEGER NOT NULL REFERENCES rooms ON DELETE RESTRICT,
	logs_time TIMESTAMP NOT NULL,
	reserve_time TIMESTAMP NOT NULL,
	status varchar(20),
	arrive DATE NOT NULL,
	departure DATE NOT NULL
);

