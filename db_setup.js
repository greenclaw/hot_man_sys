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
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY hotels(hotel_name,stars,price_id,city,country_code,country,address,url,rating)       FROM '${__dirname}/db/hotels.csv'       WITH DELIMITER ',' csv;"`)
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY rooms_types(class_name,capacity,bed_quantity) FROM '${__dirname}/db/rooms_types.csv'  WITH DELIMITER ',' csv;"`)
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY rooms(num,hotel_id,room_type)   FROM '${__dirname}/db/rooms.csv'        WITH DELIMITER ',' csv;"`)
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY guests(sure_name,last_name,age,phone,email,guest_password)    FROM '${__dirname}/db/guests.csv'       WITH DELIMITER ',' csv;"`)
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY logs(guest_id,room_id,log_time,reserve_time,log_status,arrival_date,departure_date)         FROM '${__dirname}/db/logs.csv'         WITH DELIMITER ',' csv;"`)
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY reservations(guest_id,room_id,reserve_time,reserve_status,arrival_date,departure_date) FROM '${__dirname}/db/reservations.csv' WITH DELIMITER ',' csv;"`)
shell.echo(`Finish!`)
