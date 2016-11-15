create or replace function add_guest(first_name VARCHAR, last_name VARCHAR, age NUMERIC(3), phone VARCHAR, email VARCHAR)
returns void as $$
BEGIN
	insert into guest (first_name, last_name, age, phone, email) 
	values(first_name, last_name, age, phone, email);
END;
$$ LANGUAGE plpgsql;


create or replace function add_room(num integer, hotel_id integer, type integer)
returns void as $$
BEGIN
	insert into room (num, hotel_id, type) 
	values (num, hotel_id, type);
END;
$$ LANGUAGE plpgsql;


create or replace function add_room(num integer, hotel_id integer, type integer)
returns void as $$
BEGIN
	insert into room (num, hotel_id, type) 
	values (num, hotel_id, type);
END;
$$ LANGUAGE plpgsql;