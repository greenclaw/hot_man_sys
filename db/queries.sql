﻿-- returns hotels and their rooms not reserved at with moment

select *
from rooms, room_types, price, hotels
where rooms.hotel_id = hotels.id and
      room_types.id = rooms.room_type and
      price.hotel_id = hotels.id and
      room_types.id = price.room_type_id and
     rooms.id not in (           
select distinct r.id
from rooms as r, room_types as rt, hotels as h, reservations as rs
where 
      r.hotel_id = h.id and
      r.room_type = rt.id and
      r.id = rs.room_id and
      (daterange(date '2016-11-10',date '2016-11-30') * 
       daterange(rs.arrival_date,rs.departure_date)) <> 'empty')
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

select h.hotel_name, sum(ps.cost)
from rooms as r,
		     rooms_types as rt, 
		     hotels as h, 
		     reservations as rs, 
		     prices as ps
		where 
		      ps.hotel_id = h.id and
		      ps.room_type_id= rt.id and
		      r.hotel_id = h.id and
		      r.room_type=rt.id and
		      r.id = rs.room_id and
		      rs.reservation_status = 'Paid'
		      group by h.hotel_name;

select  h.hotel_name, 
from rooms as r, room_types as rt, hotels as h, reservations as rs
where 
group by h.hotel_id

-- random hotel
select h.id
from hotels as h
where h.id = (select trunc(random() * (select count(*) from hotels) + 1));


-- views 
SELECT * from the_best_hotels;

SELECT * from all_hotels;

SELECT * from hotels_price;

SELECT * from all_users;

select * from all_rooms;


-- ram cash usage
  SELECT 
      datname as database_name, 
      CASE 
        WHEN blks_read = 0 THEN 0 
        ELSE blks_hit / blks_read 
      END AS ratio 
    FROM 
      pg_stat_database
    where datname = 'hot_man_sys';

-- insert, update, delete relation's statistic
     SELECT 
      relname, 
      n_tup_ins, 
      n_tup_upd, 
      n_tup_del 
    FROM 
      pg_stat_user_tables 
    ORDER BY 
      n_tup_upd DESC;


-- relation's loading, index usage
     SELECT 
      relname, 
      seq_scan, 
      idx_scan, 
      CASE 
        WHEN idx_scan = 0 THEN 100 
        ELSE seq_scan / idx_scan 
      END AS ratio 
    FROM 
      pg_stat_user_tables 
    ORDER BY 
      ratio DESC;

-- query duration statistic
SELECT 
      datname,
      pid,
      query,
      NOW() - query_start AS duration
    FROM
      pg_stat_activity 
    ORDER BY duration DESC;
      
