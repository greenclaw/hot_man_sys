
-- hotel id searching
CREATE UNIQUE INDEX primary_hotel
  ON public.hotels
  USING btree
  (id);
ALTER TABLE public.hotels CLUSTER ON primary_hotel;

-- city searching
CREATE INDEX city_searching
  ON public.hotels
  USING hash
  (city COLLATE pg_catalog."default");

--country searching
CREATE INDEX country_searching
  ON public.hotels
  USING hash
  (country COLLATE pg_catalog."default");


-- room id searching
CREATE UNIQUE INDEX primary_room
  ON public.rooms
  USING btree
  (id);
ALTER TABLE public.rooms CLUSTER ON primary_room;

-- log searching
CREATE UNIQUE INDEX primary_log
   ON public.logs USING btree (id ASC);
ALTER TABLE public.logs
  CLUSTER ON primary_log;

 CREATE INDEX log_searching
   ON public.logs USING btree
   (log_status ASC, log_time ASC );


-- calculating budget and executes by after delete trigger on reservations
create or replace function update_budget()
returns trigger as $update_budget$
BEGIN
	update hotels
	set budget = budget + (select sum(ps.coast) 
		from rooms as r,
		     room_types as rt, 
		     hotels as h, 
		     reservations as rs, 
		     prices as ps
		where rs.id = old.id and
		      r.hotel_id = h.id and
		      r.room_type=rt.id and
		      r.id = rs.room_id and
		      ps.hotel_id = h.id and
		      ps.room_type_id= rt.id and
		      rs.reserve_status = 'Paid');
END;
$update_budget$ 
LANGUAGE plpgsql;

create trigger compute_new_budget
AFTER DELETE ON reservations
FOR EACH ROW
EXECUTE PROCEDURE update_budget();

	  
-- reserving procedure
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
	if ((CURRENT_DATE <= arrive) or (CURRENT_DATE <= dep)) THEN
		RAISE EXCEPTION 'Date of arrive and depart must be greater then current!';
	ELSE
		insert into reservation (
					  guest_id,
					  room_id,
					  reservation_time,
					  reservation_status,
					  arrival_date, 
					  departure_date
					  )
		values (room_id, guest_id, c_time, 'Awaiting', a, d);
	END IF;
	RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- execute by scheduler on 12:00 AM to clean overdue reservations
create or replace function to_archive_not_confirmed()
returns void as $$
BEGIN
	insert into logs(
			guest_id,room_id,
			log_time,
			reservation_time,
			log_status,
			arrival_date,
			departure_date
			)
	select ( r.guest_id,
		 r.room_id,
		 CURRENT_TIMESTAMP,
		 r.reservation_time,
		 'Not confirmed',
		 r.arrival_date,
		 r.departure_date)
	from reservations as r

	Where reservation_status='Not confirmed';
END;
$$ LANGUAGE plpgsql;

-- logging procedure executed by insert, update, delete triggers on reservations table
CREATE OR REPLACE FUNCTION event_to_log()
RETURNS trigger AS
$event_to_log$
DECLARE
	status_var varchar(20);
BEGIN
	IF TG_NAME='reserve_new_room' THEN
		insert into logs (guest_id,room_id,log_time,reservation_time,log_status,arrival_date,departure_date)
		values( new.guest_id,
			new.room_id,
			CURRENT_TIMESTAMP,
			new.reservation_time,
			'Reserved',
			new.arrival_date,
			new.departure_date);
	ELSE 	IF TG_NAME='unreserve_room' THEN
			status_var := 'Unreserved room';
		ELSE 	IF TG_NAME='update_room_reservation' THEN
			   IF ( OLD.reserve_status <> 'Paid' 
				AND NEW.reserve_status = 'Paid') THEN
				status_var := 'Paid';
			   ELSE
				status_var := OLD.reservation_status;
			   END IF;
			END IF;
		END IF;

		insert into logs ( guest_id,
				   room_id,
				   log_time,
				   reservation_time,
				   log_status,
				   arrival_date,
				   departure_date)
				values( 
					old.guest_id,
					old.room_id,
					CURRENT_TIMESTAMP,
					old.reservation_time,
					status_var,
					old.arrival_date,
					old.departure_date
				);
	END IF;
	return new;
END;
$event_to_log$ LANGUAGE plpgsql;

CREATE TRIGGER reserve_new_room
BEFORE INSERT ON reservations
FOR EACH ROW
EXECUTE PROCEDURE event_to_log();

CREATE TRIGGER unreserve_room
BEFORE DELETE ON reservations
FOR EACH ROW
EXECUTE PROCEDURE event_to_log();

CREATE TRIGGER update_room_reservation
BEFORE UPDATE ON reservations
FOR EACH ROW
EXECUTE PROCEDURE event_to_log();

--create or replace function add_customer(surname VARCHAR, lastname VARCHAR, age NUMERIC(3), user VARCHAR, e_mail VARCHAR)
--returns void as $$
--BEGIN
--	insert into guest (surname,lastname, age, phone, e_mail) 
--	values(surname,lastname, age, phone, e_mail);
--END;
--$$ LANGUAGE plpgsql;

