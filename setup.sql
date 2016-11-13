drop table if exists receptionist;
drop table if exists manager;
drop table if exists employee;
drop table if exists log;
drop table if exists reservation;
drop table if exists guest;
drop table if exists room;
drop table if exists price;
drop table if exists room_type;
drop table if exists hotel;

CREATE TABLE if not exists hotel (
	id INTEGER PRIMARY KEY,
	hotelName VARCHAR NOT NULL,
	stars NUMERIC(2,1),
	price INTEGER,
	cityName VARCHAR,
	countryCode VARCHAR(2) NOT NULL,
	countryName VARCHAR NOT NULL,
	address VARCHAR,
	url VARCHAR,
	rating NUMERIC(3,1)
);

CREATE TABLE if not exists room_type(
	id SERIAL PRIMARY KEY,
	class VARCHAR(20),
	room_quantity NUMERIC(1)
);

CREATE TABLE price( 
	hotel_id INTEGER REFERENCES hotel ON DELETE CASCADE,
	type_id INTEGER REFERENCES room_type,
	coast MONEY,
	PRIMARY KEY (hotel_id, type_id)
);

CREATE TABLE if not exists room(
	room_id SERIAL PRIMARY KEY,
	num INTEGER NOT NULL,
	hotel_id INTEGER REFERENCES hotel,
	type INTEGER REFERENCES room_type
);

CREATE TABLE if not exists guest(
	id SERIAL PRIMARY KEY,
	surname VARCHAR NOT NULL,
	lastname VARCHAR NOT NULL,
	age NUMERIC(3) NOT NULL,
	phone VARCHAR,
	e_mail VARCHAR
);

CREATE TABLE if not exists reservation(
	id SERIAL PRIMARY KEY,
	guest_id INTEGER NOT NULL REFERENCES guest,
	room_id INTEGER NOT NULL REFERENCES room ON DELETE RESTRICT,
	reserve_date DATE NOT NULL,
	arrive DATE NOT NULL,
	departure DATE NOT NULL CHECK (departure > arrive)
);

CREATE TABLE if not exists log(
	id SERIAL PRIMARY KEY,
	guest_id INTEGER NOT NULL REFERENCES guest,
	room_id INTEGER NOT NULL REFERENCES room ON DELETE RESTRICT,
	log_date DATE NOT NULL,
	reserve_date DATE NOT NULL,
	arrive DATE NOT NULL,
	departure DATE NOT NULL
);

CREATE TABLE if not exists employee
(
  id SERIAL NOT NULL,
  surname VARCHAR(50) NOT NULL,
  firstname VARCHAR(50) NOT NULL,
  salary MONEY NOT NULL DEFAULT 1000,
  CONSTRAINT pk_employee PRIMARY KEY (id)
);

CREATE TABLE if not exists manager
(
  phone VARCHAR(12),
  CONSTRAINT pk_manager PRIMARY KEY (id)
) INHERITS (employee);

CREATE TABLE if not exists receptionist
(
  shift NUMERIC(1,0),
  hotel_id INTEGER,
  CONSTRAINT pk_receptionist PRIMARY KEY (id)
) INHERITS (employee);

