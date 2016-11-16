-- returns hotels and their rooms not reserved at with moment
select r.id, r.num, h.hotel_name, rt.class_name, rs.arrival_date, rs.departure_date
from rooms as r, rooms_types as rt, hotels as h, reservations as rs
where r.hotel_id = h.id and
      r.room_type=rt.id and
      r.id = rs.room_id and 
      ((rs.arrival_date > date '2016-11-30') and
           (rs.departure_date > date '2016-11-30')
           or (rs.arrival_date < date '2016-11-25') and
           (rs.departure_date < date '2016-11-25'));
      -- and CURRENT_TIMESTAMP > CURRENT_TIMESTAMP ;


select r.id, r.num, h.hotel_name, rt.class_name, rs.arrival_date, rs.departure_date
from rooms as r, rooms_types as rt, hotels as h, reservations as rs
where r.hotel_id = h.id and
      r.room_type=rt.id and
      r.id = rs.room_id and 
      (h.hotel_name  like '%In%');

select r.id, r.num, h.hotel_name, rt.class_name, rs.arrival_date, rs.departure_date
from rooms as r, rooms_types as rt, hotels as h, reservations as rs
where r.hotel_id = h.id and
      r.room_type=rt.id and
      r.id = rs.room_id and 
      (h.country='Russia');

select r.id, r.num, h.hotel_name, rt.class_name, rs.arrival_date, rs.departure_date
from rooms as r, rooms_types as rt, hotels as h, reservations as rs
where r.hotel_id = h.id and
      r.room_type=rt.id and
      r.id = rs.room_id and 
      (h.city= 'Bangkok');

-- random hotel
select h.id
from hotels as h
where h.id = (select trunc(random() * (select count(*) from hotels) + 1));

