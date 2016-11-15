/// <reference path="../typings/index.d.ts" />

import * as promise from 'bluebird'

const pgPromiseOptions = { promiseLib: promise }
const pgPromise = require('pg-promise')(pgPromiseOptions);
const pg = pgPromise({
    host: 'localhost',
    port: 5433,
    database: 'hot_man_sys',
    user: 'hot_man_sys',
    password: 'hot_man_sys'
});

const qrm = pgPromise.queryResult

interface Guest {
    id: number,
    first_name: string,
    last_name: string,
    age: number,
    phone: string,
    email: string,
    password: string
}

const guests = {
    findByEmail: (email: string, callback) => {
        pg.query(`SELECT * FROM guest WHERE email = '${email}'`, email, qrm.one | qrm.none)
            .then((guest: Guest) => {
                if (guest) {
                    console.log(`Email is correct`)
                    return callback(null, guest)
                } else {
                    console.log(`Email is not correct`)
                    return callback(null, null)
                }
            })
            .catch((error) => {
                console.log("ERROR:", error); // print the error;
            })
            .finally(() => {
                pgPromise.end(); // for immediate app exit, closing the connection pool.
            });
    },

    findById: (id: number, callback) => {
        pg.query(`SELECT * FROM guest WHERE id = '${id}'`, id, qrm.one | qrm.none)
            .then((guest: Guest) => {
                if (guest) {
                    console.log(`There is a guest ${id}`)
                    return callback(null, guest)
                } else {
                    return callback(new Error(`Guest ${id} does not exist`))
                }
            })
            .catch((error) => {
                console.log("ERROR:", error); // print the error;
            })
            .finally(() => {
                pgPromise.end(); // for immediate app exit, closing the connection pool.
            });
    },

    register: (guest: Guest, callback) => {
        pg.query(`INSERT INTO guest ($<this~>) VALUES (
            $<id>,
            $<first_name>,
            $<last_name>,
            $<age>,
            $<phone>,
            $<email>,
            $<password> )`, guest, qrm.none)
            .then(() => {
                console.log("GUEST:", guest)
                callback(null, guest)
            })
            .catch((error) => {
                console.log("ERROR:", error); // print the error;
            })
            .finally(() => {
                pgPromise.end(); // for immediate app exit, closing the connection pool.
            });
    }
}

export { Guest, guests }

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