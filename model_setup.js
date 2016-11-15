'use strict'

var shell = require('shelljs')

shell.echo(`Start!`)

const postgresPort = `5433`
const postgresUser = `postgres`
const postgresPassword = ``

const prefix = `psql -p ${postgresPort} -U ${postgresUser}`

shell.exec(`${prefix} -c "DROP DATABASE IF EXISTS hot_man_sys;"`)
shell.exec(`${prefix} -c "CREATE DATABASE hot_man_sys;"`)
shell.exec(`${prefix} -d hot_man_sys < ${__dirname}/db/setup.sql`)
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY hotels       FROM '${__dirname}/db/hotels.csv'       WITH DELIMITER ',' csv;"`)
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY room_types   FROM '${__dirname}/db/room_types.csv'   WITH DELIMITER ',' csv;"`)
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY rooms        FROM '${__dirname}/db/rooms.csv'        WITH DELIMITER ',' csv;"`)
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY guests       FROM '${__dirname}/db/guests.csv'       WITH DELIMITER ',' csv;"`)
shell.exec(`${prefix} -d hot_man_sys -c "\\COPY logs         FROM '${__dirname}/db/logs.csv'         WITH DELIMITER ',' csv;"`)
// shell.exec(`${prefix} -d hot_man_sys -c "\\COPY reservations FROM '${__dirname}/db/reservations.csv' WITH DELIMITER ',' csv;"`)


shell.echo(`Finish!`)