'use strict'

var shell = require('shelljs')

shell.echo(`Start!`)

shell.exec(`psql -p 5433 -U postgres -c "DROP DATABASE IF EXISTS hot_man_sys;"`)
shell.exec(`psql -p 5433 -U postgres -c "CREATE DATABASE hot_man_sys;"`)
shell.exec(`psql -p 5433 -U postgres -d hot_man_sys < ${__dirname}/db/setup.sql`)
shell.exec(`psql -p 5433 -U postgres -d hot_man_sys -c "\\COPY hotels FROM '${__dirname}/db/hotels.csv' WITH DELIMITER ',' csv;"`)

shell.echo(`Finish!`)