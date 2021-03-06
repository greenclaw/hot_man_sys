'use strict'

var shell = require('shelljs')

shell.echo(`Start!`)

const postgresPort = `5432`
//const postgresPort = `5433`
const postgresUser = `postgres`
const postgresPassword = ``

const prefix = `psql -p ${postgresPort} -U ${postgresUser}`

shell.exec(`${prefix} -c "DROP DATABASE IF EXISTS hot_man_sys;"`)
shell.exec(`${prefix} -c "CREATE DATABASE hot_man_sys;"`)
shell.exec(`${prefix} -d hot_man_sys < ${__dirname}/db/setup.sql`)
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY hotels(hotel_name,star_num,city,country_code,country,address,url,rating,budget)       FROM '${__dirname}/db/hotels.csv'       WITH DELIMITER ',' csv;"`)
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY room_types(class_name,capacity,bed_num) FROM '${__dirname}/db/room_types.csv'  WITH DELIMITER ',' csv;"`)
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY rooms(num,hotel_id,room_type,floor)   FROM '${__dirname}/db/rooms.csv'        WITH DELIMITER ',' csv;"`)
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY owners(first_name,last_name,date_of_birth,phone,username,email,user_password)       FROM '${__dirname}/db/owners.csv'       WITH DELIMITER ',' csv;"`)
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY guests(first_name,last_name,date_of_birth,phone,username,email,user_password,payments)    FROM '${__dirname}/db/guests.csv'       WITH DELIMITER ',' csv;"`)
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY hotel_owners       FROM '${__dirname}/db/hotel_owners.csv'       WITH DELIMITER ',' csv;"`)
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY logs(room_id,guest_id,log_time,reservation_time,log_status,arrival_date,departure_date)         FROM '${__dirname}/db/logs.csv'         WITH DELIMITER ',' csv;"`)
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY reservations(room_id,guest_id,reservation_time,reservation_status,arrival_date,departure_date) FROM '${__dirname}/db/reservations.csv' WITH DELIMITER ',' csv;"`)
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY price(hotel_id,room_type_id,cost)   FROM '${__dirname}/db/prices.csv'        WITH DELIMITER ',' csv;"`)
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY managers(first_name,last_name,date_of_birth,username,user_password,email,phone,hotel_id,salary)   FROM '${__dirname}/db/managers.csv'        WITH DELIMITER ',' csv;"`)
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY staff(first_name,last_name,phone,date_of_birth,hotel_id,salary)   FROM '${__dirname}/db/staff.csv'        WITH DELIMITER ',' csv;"`)

shell.exec(`${prefix} -d hot_man_sys < ${__dirname}/db/stored_procedures.sql`)

shell.echo(`Finish!`)
