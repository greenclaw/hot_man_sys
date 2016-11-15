create or replace function add_guest(first_name VARCHAR, last_name VARCHAR, age NUMERIC(3), phone VARCHAR, email VARCHAR)
returns void as $$
BEGIN
	insert into guests (first_name, last_name, age, phone, email) 
	values(first_name, last_name, age, phone, email);
END;
$$ LANGUAGE plpgsql;




create or replace function add_room(num integer, hotel_id integer, type integer)
returns void as $$
BEGIN
	insert into rooms (num, hotel_id, type) 
	values (num, hotel_id, type);
END;
$$ LANGUAGE plpgsql;



create or replace function check_reservation(cur_time TIMESTAMP, arrive DATE, dep DATE)
returns boolean as $$
DECLARE
	c_time DATE;
BEGIN
	c_time := cur_time::date;
	if ((c_time <= arrive) or (c_time <= dep)) THEN
		RAISE EXCEPTION 'Date of arrive and depart must be greater then current!';
	END IF;
	RETURN TRUE;
END
$$ LANGUAGE plpgsql;




create or replace function reserve_room(room_id integer, guest_id integer, arrive varchar, dep varchar)
returns boolean as $$
DECLARE 
	c_time TIMESTAMP;
	a DATE;
	d DATE;
BEGIN
	c_time := CURRENT_TIMESTAMP;
	a = to_date(arrive, 'YYYY-MM-DD');
	d = to_date(dep, 'YYYY-MM-DD');
	if (check_reservation(c_time, a, d)) THEN
		insert into reservation (guest_id , room_id, reserve_time, arrive, departure) 
		values (room_id, guest_id, c_time, a, d);
	END IF;
	RETURN TRUE;
END;
$$ LANGUAGE plpgsql;




create or replace function to_archive(num integer, hotel_id integer, type integer)
returns void as $$
BEGIN
	insert into rooms (num, hotel_id, type) 
	values (num, hotel_id, type);
END;
$$ LANGUAGE plpgsql;



