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
    findByEmail: function (email, callback) {
        pg.oneOrNone("SELECT * FROM guests WHERE email = '" + email + "'", email)
            .then(function (guest) {
            if (guest) {
                console.log("Email is correct");
                return callback(null, guest);
            }
            else {
                console.log("Email is not correct");
                return callback(null, null);
            }
        })
            .catch(function (error) {
            console.log("ERROR:", error); // print the error;
        })
            .finally(function () {
            pgPromise.end(); // for immediate app exit, closing the connection pool.
        });
    },
    findById: function (id, callback) {
        pg.oneOrNone("SELECT * FROM guests WHERE id = '" + id + "'", id)
            .then(function (guest) {
            if (guest) {
                console.log("There is a guest " + id);
                return callback(null, guest);
            }
            else {
                return callback(new Error("Guest " + id + " does not exist"));
            }
        })
            .catch(function (error) {
            console.log("ERROR:", error); // print the error;
        })
            .finally(function () {
            pgPromise.end(); // for immediate app exit, closing the connection pool.
        });
    },
    signup: function (guest, callback) {
        console.log(guest);
        pg.none("INSERT INTO guests (\n                $<this~>\n            ) VALUES (\n                $<id>\n                $<first_name>,\n                $<last_name>,\n                $<email>,\n                $<password> \n            );", guest)
            .then(function () {
            callback(null, guest);
        })
            .catch(function (error) {
            console.log("ERROR:", error); // print the error;
            callback(error, null);
        })
            .finally(function () {
            pgPromise.end(); // for immediate app exit, closing the connection pool.
        });
    }
};
exports.guests = guests;
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
//# sourceMappingURL=db.js.map