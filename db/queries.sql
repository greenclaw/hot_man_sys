-- returns hotels and their rooms not reserved at with moment
select r.id, r.num, h.hotel_name, rt.class_name, rs.arrival_date, rs.departure_date
from rooms as r, room_types as rt, hotels as h, reservations as rs
where r.hotel_id = h.id and
      r.room_type=rt.id and
      r.id = rs.room_id and 
      ((rs.arrival_date > date '2016-11-30') and
           (rs.departure_date > date '2016-11-30')
           or (rs.arrival_date < date '2016-11-25') and
           (rs.departure_date < date '2016-11-25'));
      -- and CURRENT_TIMESTAMP > CURRENT_TIMESTAMP ;


select r.id, r.num, h.hotel_name, rt.class_name, rs.arrival_date, rs.departure_date
from rooms as r, room_types as rt, hotels as h, reservations as rs
where r.hotel_id = h.id and
      r.room_type=rt.id and
      r.id = rs.room_id and 
      (h.hotel_name  like '%In%');

select r.id, r.num, h.hotel_name, rt.class_name, rs.arrival_date, rs.departure_date
from rooms as r, room_types as rt, hotels as h, reservations as rs
where r.hotel_id = h.id and
      r.room_type=rt.id and
      r.id = rs.room_id and 
      (h.country='Russia');

select r.id, r.num, h.hotel_name, rt.class_name, rs.arrival_date, rs.departure_date
from rooms as r, room_types as rt, hotels as h, reservations as rs
where r.hotel_id = h.id and
      r.room_type=rt.id and
      r.id = rs.room_id and 
      (h.city= 'Bangkok');

select h.hotel_name, sum(ps.coast)
from rooms as r, room_types as rt, hotels as h, reservations as rs, prices as ps
where ps.hotel_id = h.id and
      ps.room_type_id= rt.id and
      r.hotel_id = h.id and
      r.room_type=rt.id and
      r.id = rs.room_id and
      rs.reserve_status = 'Paid'
 Group by h.id;

create index primary_logs
on public.logs 

-- show new budget
 select hotels.id, ((select sum(ps.coast) as s
		from
		     rooms as r,
		     room_types as rt, 
		     hotels as h, 
		     reservations as rs, 
		     prices as ps
		where h.id = hotels.id and
		      ps.hotel_id = h.id and
		      ps.room_type_id= rt.id and
		      r.hotel_id = h.id and
		      r.room_type=rt.id and
		      r.id = rs.room_id and
		      rs.reserve_status = 'Paid'
		      group by h.id))
		      from hotels;

select logs.id, logs.log_status, logs.log_time
from logs
where logs.id > 500000 and logs.id < 800000 and logs.log_status = 'Not confirmed';

select h.hotel_name, sum(ps.coast)
from rooms as r,
		     room_types as rt, 
		     hotels as h, 
		     reservations as rs, 
		     prices as ps
		where 
		      ps.hotel_id = h.id and
		      ps.room_type_id= rt.id and
		      r.hotel_id = h.id and
		      r.room_type=rt.id and
		      r.id = rs.room_id and
		      rs.reserve_status = 'Paid'
		      group by h.hotel_name;

select  h.hotel_name, 
from rooms as r, room_types as rt, hotels as h, reservations as rs
where 
group by h.hotel_id

-- random hotel
select h.id
from hotels as h
where h.id = (select trunc(random() * (select count(*) from hotels) + 1));

