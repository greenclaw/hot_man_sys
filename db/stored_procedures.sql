create or replace function add_guest(surname VARCHAR, lastname VARCHAR, age NUMERIC(3), phone VARCHAR, e_mail VARCHAR)
returns void as $$
BEGIN
	insert into guest (surname,lastname, age, phone, e_mail) 
	values(surname,lastname, age, phone, e_mail);
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