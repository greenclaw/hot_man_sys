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
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY rooms_types(class_name,capacity,bed_num) FROM '${__dirname}/db/rooms_types.csv'  WITH DELIMITER ',' csv;"`)
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY rooms(num,hotel_id,room_type)   FROM '${__dirname}/db/rooms.csv'        WITH DELIMITER ',' csv;"`)
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY accounts(first_name,last_name,login_name,email,account_password)    FROM '${__dirname}/db/accounts.csv'       WITH DELIMITER ',' csv;"`)
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY logs(guest_id,room_id,log_time,reserve_time,log_status,arrival_date,departure_date)         FROM '${__dirname}/db/logs.csv'         WITH DELIMITER ',' csv;"`)
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY reservations(guest_id,room_id,reserve_time,reserve_status,arrival_date,departure_date) FROM '${__dirname}/db/reservations.csv' WITH DELIMITER ',' csv;"`)
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY prices(hotel_id,room_type_id,coast)   FROM '${__dirname}/db/prices.csv'        WITH DELIMITER ',' csv;"`)
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY managers(first_name,last_name,login_name,salary,email,phone_number,hotel_id,account_password)   FROM '${__dirname}/db/managers.csv'        WITH DELIMITER ',' csv;"`)
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY staff(first_name,last_name,salary,hotel_id)   FROM '${__dirname}/db/staff.csv'        WITH DELIMITER ',' csv;"`)



shell.echo(`Finish!`)
