/// <reference path="../typings/index.d.ts" />
"use strict";
var bluebirdPromise = require('bluebird');
var pgPromiseOptions = { promiseLib: bluebirdPromise };
var postgresPromise = require('pg-promise');
var pgPromise = postgresPromise(pgPromiseOptions);
var pg = pgPromise({
    host: 'localhost',
    port: 5433,
    database: 'hot_man_sys',
    user: 'hot_man_sys',
    password: 'hot_man_sys'
});
var qrm = pgPromise.queryResult;
var guests = {
    getOne: function (attribute, value, callback) {
        console.log(pgPromise.as.format("SELECT * FROM guests WHERE $<attribute> = $<value>", { attribute: attribute, value: value }));
        pg.oneOrNone("SELECT * FROM guests WHERE $<attribute> = $<value>", { attribute: attribute, value: value })
            .then(function (guest) {
            if (guest) {
                console.log("There is a guest with " + attribute + " " + value);
                return callback(null, guest);
            }
            console.log("There is NO guest with " + attribute + " " + value);
            callback(new Error("There is NO guest with " + attribute + " " + value));
        })
            .catch(function (error) {
            console.log("ERROR: ", error);
            callback(error);
        })
            .finally(function () {
            pgPromise.end();
        });
    },
    create: function (guest, callback) {
        console.log(pgPromise.as.format("INSERT INTO guests (\n                $<this~>\n            ) VALUES (\n                $<first_name>,\n                $<last_name>,\n                $<email>,\n                $<guest_password> \n            );", guest));
        pg.none("INSERT INTO guests (\n                $<this~>\n            ) VALUES (\n                $<first_name>,\n                $<last_name>,\n                $<email>,\n                $<guest_password> \n            );", guest)
            .then(function () {
            callback(null, guest);
        })
            .catch(function (error) {
            console.log("ERROR:", error); // print the error;
            callback(error);
        })
            .finally(function () {
            pgPromise.end(); // for immediate app exit, closing the connection pool.
        });
    }
};
exports.guests = guests;
/*
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
//# sourceMappingURL=model.js.map