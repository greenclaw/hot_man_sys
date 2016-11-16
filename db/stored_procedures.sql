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

-- execute by scheduler on 12:00 AM to clean overdue reservations
create or replace function to_archive_not_confirmed()
returns void as $$
BEGIN
	insert into logs(guest_id,room_id,log_time,reserve_time,log_status,arrival_date,departure_date)
	select (guest_id, room_id,CURRENT_TIMESTAMP,reserve_time,'Not confirmed',arrival_date,departure_date)
	from reservations
	Where reserve_status='Not confirmed';
END;
$$ LANGUAGE plpgsql;

select to_archive_not_confirmed();

-- salary of manager in particularly hotel must be greater than
-- staff of this hotel
create or replace function check_salary(m_salary manager, s_salary money) 
returns boolean as $$
BEGIN
	
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION clear_reservations()
  RETURNS boolean AS
$BODY$
BEGIN
	delete from reservations as res
	where res.arrive_date >= CURRENT_DATE;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public.clear_reservations()
  OWNER TO hot_man_sys;


CREATE OR REPLACE FUNCTION event_to_log()
RETURNS trigger AS
$event_to_log$
BEGIN
	IF TG_NAME='reserve_new_room' THEN
		insert into logs (guest_id,room_id,log_time,reserve_time,log_status,arrival_date,departure_date)
		values( new.guest_id,
			new.room_id,
			CURRENT_TIMESTAMP,
			new.reserve_time,
			'Reserved',
			new.arrival_date,
			new.departure_date);
	ELSE 	IF TG_NAME='unreserve_room' THEN
			insert into logs (guest_id,room_id,log_time,reserve_time,log_status,arrival_date,departure_date)
			values( old.guest_id,
			old.room_id,
			CURRENT_TIMESTAMP,
			old.reserve_time,
			'Released',
			old.arrival_date,
			old.departure_date);
		ELSE 	IF TG_NAME='update_room_reservation' THEN
			   IF ( OLD.reserve_status <> 'Paid' 
				AND NEW.reserve_status = 'Paid') THEN
				insert into logs (guest_id,room_id,log_time,reserve_time,log_status,arrival_date,departure_date)
				values( old.guest_id,
				old.room_id,
				CURRENT_TIMESTAMP,
				old.reserve_time,
				'Paid',
				old.arrival_date,
				old.departure_date);
			   ELSE
				insert into logs (guest_id,room_id,log_time,reserve_time,log_status,arrival_date,departure_date)
				values( old.guest_id,
				old.room_id,
				CURRENT_TIMESTAMP,
				old.reserve_time,
				'Updated',
				old.arrival_date,
				old.departure_date);
			   END IF;
			END IF;
		END IF;
		
	END IF;
	return new;
END;
$event_to_log$ LANGUAGE plpgsql;

CREATE TRIGGER reserve_new_room
BEFORE INSERT ON reservations
FOR EACH ROW
EXECUTE PROCEDURE event_to_log();

CREATE TRIGGER unreserve_room
BEFORE INSERT ON reservations
FOR EACH ROW
EXECUTE PROCEDURE event_to_log();

CREATE TRIGGER update_room_reservation
BEFORE UPDATE ON reservations
FOR EACH ROW
EXECUTE PROCEDURE event_to_log();

