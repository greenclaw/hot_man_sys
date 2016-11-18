'use strict'

var shell = require('shelljs')

shell.echo(`Start!`)

const postgresPort = `5432`
//const postgresPort = `5433`
const postgresUser = `postgres`
const postgresPassword = ``

const prefix = `psql -p ${postgresPort} -U ${postgresUser}`

shell.exec(`${prefix} -c "DROP DATABASE IF EXISTS hot_man_sys;"`)
shell.exec(`${prefix} -f ${__dirname}/db/dump.sql`)

shell.echo(`Finish!`)
