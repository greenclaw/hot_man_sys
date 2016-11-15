/// <reference path="../typings/index.d.ts" />

import * as bluebirdPromise from 'bluebird'

const pgPromiseOptions = { promiseLib: bluebirdPromise }
import * as postgresPromise from 'pg-promise';
const pgPromise = postgresPromise(pgPromiseOptions);
const pg = pgPromise({
    host: 'localhost',
    port: 5433,
    database: 'hot_man_sys',
    user: 'hot_man_sys',
    password: 'hot_man_sys'
});

const qrm = pgPromise.queryResult

interface Table {
    id: number
}

interface Guest extends Table {
    first_name: string,
    last_name: string,
    age?: number,
    phone?: string,
    email: string,
    guest_password: string
}

const guests = {
    getByEmail: (email: string, callback) => {
        pg.oneOrNone(`SELECT * FROM guests WHERE email = '${email}'`, email)
            .then((guest: Guest) => {
                if (guest) {
                    console.log(`Email is correct`)
                    return callback(null, guest)
                }
                console.log(`Email is not correct`)
                callback(new Error(`Email is not correct`))
            })
            .catch((error) => {
                console.log("ERROR:", error); // print the error;
                callback(error)
            })
            .finally(() => {
                pgPromise.end(); // for immediate app exit, closing the connection pool.
            });
    },

    getById: (id: number, callback) => {
        pg.oneOrNone(`SELECT * FROM guests WHERE id = '${id}'`, id)
            .then((guest: Guest) => {
                if (guest) {
                    console.log(`There is a guest ${id}`)
                    return callback(null, guest)
                }
                callback(new Error(`Guest ${id} does not exist`))
            })
            .catch((error) => {
                console.log("ERROR:", error); // print the error;
                callback(error)
            })
            .finally(() => {
                pgPromise.end(); // for immediate app exit, closing the connection pool.
            });
    },

    getOne: (attribute: string, value: string | number, callback) => {

        console.log(pgPromise.as.format(`SELECT * FROM guests WHERE $<attribute> = $<value>`, 
            { attribute, value }))

        pg.oneOrNone(`SELECT * FROM guests WHERE $<attribute> = $<value>`, { attribute, value })
            .then((guest: Guest) => {
                if (guest) {
                    console.log(`There is a guest with ${attribute} ${value}`)
                    return callback(null, guest)
                }
                console.log(`There is NO guest with ${attribute} ${value}`)
                callback(new Error(`There is NO guest with ${attribute} ${value}`))
            })
            .catch((error) => {
                console.log(`ERROR: `, error)
                callback(error)
            })
            .finally(() => {
                pgPromise.end()
            })
    },

    create: (guest: Guest, callback) => {

        console.log(pgPromise.as.format(`INSERT INTO guests (
                $<this~>
            ) VALUES (
                $<first_name>,
                $<last_name>,
                $<email>,
                $<guest_password> 
            );`, guest))

        pg.none(`INSERT INTO guests (
                $<this~>
            ) VALUES (
                $<first_name>,
                $<last_name>,
                $<email>,
                $<guest_password> 
            );`, guest)
            .then(() => {
                callback(null, guest)
            })
            .catch((error) => {
                console.log("ERROR:", error); // print the error;
                callback(error)
            })
            .finally(() => {
                pgPromise.end(); // for immediate app exit, closing the connection pool.
            });
    }
}

export { Table, Guest, guests }

/*

pg.query(`select table_name, column_name, data_type, character_maximum_length
from INFORMATION_SCHEMA.COLUMNS 
WHERE table_schema = 'public' 
ORDER BY table_name;`)
    .then(function (data) {
        console.log("DATA:", data); // print data;
    })
    .catch(function (error) {
        console.log("ERROR:", error); // print the error;
    })
    .finally(function () {
        pgp.end(); // for immediate app exit, closing the connection pool.
    });
*/