drop table if exists hotels;
create table if not exists hotels (
	id INTEGER PRIMARY KEY,
	hotelName VARCHAR NOT NULL,
	stars numeric(2,1),
	price integer,
	cityName VARCHAR,
	countryCode VARCHAR(2) NOT NULL,
	countryName VARCHAR NOT NULL,
	address VARCHAR,
	url VARCHAR,
	rating numeric(3,1)
);

