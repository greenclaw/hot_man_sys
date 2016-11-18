/// <reference path="../typings/index.d.ts" />
"use strict";
var bluebirdPromise = require('bluebird');
var pgPromiseOptions = { promiseLib: bluebirdPromise };
var postgresPromise = require('pg-promise');
var pgMonitor = require("pg-monitor");
var pgPromise = postgresPromise(pgPromiseOptions);
pgMonitor.attach(pgPromiseOptions);
var pg = pgPromise({
    host: 'localhost',
    port: 5433,
    database: 'hot_man_sys',
    user: 'hot_man_sys',
    password: 'hot_man_sys'
});
var qrm = pgPromise.queryResult;
var hotels = {
    selectUnreservedRooms: function (roomRes, done) {
        pg.any("\n        select *\n        from   rooms, room_types, prices, hotels\n        where\n          rooms.hotel_id  = hotels.id           and\n          room_types.id   = rooms.room_type     and\n          prices.hotel_id = hotels.id           and\n          room_types.id   = prices.room_type_id and\n          rooms.id not in (\n            select distinct r.id\n            from   rooms as r, room_types as rt, hotels as h, reservations as rs\n            where\n              h.city      = $<city>    and\n              r.hotel_id  = h.id       and\n              r.room_type = rt.id      and\n              r.id        = rs.room_id and (\n                daterange(date $<arrival_date>, date $<departure_date>) * \n                daterange(rs.arrival_date, rs.departure_date)) <> 'empty')", roomRes)
            .then(function (roomReservs) {
            if (roomReservs.length > 0) {
                console.log("\n              There are rooms available in " + roomRes.city + "\n              from " + roomRes.arrival_date + " \n              to   " + roomRes.departure_date);
                return done(null, roomReservs);
            }
            console.log("\n            There are rooms availablee in " + roomRes.city + "\n            from " + roomRes.arrival_date + " \n            to   " + roomRes.departure_date);
            return done(null, false);
        })
            .catch(function (err) {
            console.log("Querying error: ", err);
            return done(new Error("Querying error: " + err));
        })
            .finally(function () {
            // for immediate app exit, closing the connection pool.
            pgPromise.end();
        });
    }
};
exports.hotels = hotels;
function del(tableName, key, keyValue, done) {
    pg.none("\n      DELETE $<tableName>\n      WHERE  $<key^> = $<keyValue>;", { tableName: tableName, key: key, keyValue: keyValue })
        .then(function () {
        console.log("Tuples with " + key + " " + keyValue + " deleted from " + tableName);
        return done(null, false);
    })
        .catch(function (err) {
        console.log("Querying error: ", err);
        return done(new Error("Querying error: " + err));
    })
        .finally(function () {
        // for immediate app exit, closing the connection pool.
        pgPromise.end();
    });
}
exports.del = del;
function selectOne(tableName, key, keyValue, done) {
    pg.oneOrNone("\n      SELECT * \n      FROM   $<tableName^>\n      WHERE  $<key^> = $<keyValue>;", { tableName: tableName, key: key, keyValue: keyValue })
        .then(function (tuple) {
        if (tuple) {
            console.log("\n            There is a tuple with " + key + " " + keyValue + " \n            in " + tableName);
            return done(null, tuple);
        }
        console.log("\n          There is NO tuple with " + key + " " + keyValue + " \n          in " + tableName);
        return done(null, false);
    })
        .catch(function (err) {
        console.log("Querying error: ", err);
        return done(new Error("Querying error: " + err));
    })
        .finally(function () {
        // for immediate app exit, closing the connection pool.
        pgPromise.end();
    });
}
exports.selectOne = selectOne;
function selectMany(tableName, key, keyValue, done) {
    pg.any("\n      SELECT * \n      FROM   $<tableName> \n      WHERE  $<key^> = $<keyValue>;", { key: key, keyValue: keyValue })
        .then(function (tuples) {
        if (tuples.length > 0) {
            console.log("\n            There are tuples with " + key + " " + keyValue + " \n            in " + tableName);
            return done(null, tuples);
        }
        console.log("\n          There are NO tuples with " + key + " " + keyValue + " \n          in " + tableName);
        return done(null, false);
    })
        .catch(function (err) {
        console.log("Querying error: ", err);
        return done(new Error("Querying error: " + err));
    })
        .finally(function () {
        // for immediate app exit, closing the connection pool.
        pgPromise.end();
    });
}
exports.selectMany = selectMany;
function selectAll(tableName, done) {
    pg.any("\n      SELECT * \n      FROM   $<tableName^>;", { tableName: tableName })
        .then(function (tuples) {
        if (tuples.length > 0) {
            console.log("There are tuples in " + tableName);
            return done(null, tuples);
        }
        console.log("There are NO tuples in " + tableName);
        return done(null, false);
    })
        .catch(function (err) {
        console.log("Querying error: ", err);
        return done(new Error("Querying error: " + err));
    })
        .finally(function () {
        // for immediate app exit, closing the connection pool.
        pgPromise.end();
    });
}
exports.selectAll = selectAll;
function update(tableName, key, keyValue, attr, attrValue, done) {
    pg.none("\n      UPDATE $<tableName^> \n      SET    $<attr^> = $<attrValue> \n      WHERE  $<key^>  = $<keyValue>;", { tableName: tableName, key: key, keyValue: keyValue, attr: attr, attrValue: attrValue })
        .then(function () {
        console.log("\n          Successful update of " + attr + " to " + attrValue + " \n          of tuples with " + key + " " + keyValue);
        return done(null, true);
    })
        .cathc(function (err) {
        console.log("Updating error: ", err);
        return done(new Error("Updating error: " + err));
    })
        .finally(function () {
        // for immediate app exit, closing the connection pool.
        pgPromise.end();
    });
}
exports.update = update;
function insert(tableName, attrs, vals, done) {
    pg.none("\n      INSERT INTO $<tableName^> ($<attrs^>) \n      VALUES ($<vals^>);", {
        tableName: tableName,
        attrs: attrs.map(pgPromise.as.name).join(),
        vals: vals.map(function (val) {
            if (typeof val === "number")
                return val;
            return "'" + val + "'";
        }).join(", ")
    })
        .then(function () {
        console.log("Successful inserting of " + vals + " to " + attrs + " in " + tableName);
        return done(null, true);
    })
        .catch(function (err) {
        console.log("Inserting error: ", err);
        return done(new Error("Inserting error: " + err));
    })
        .finally(function () {
        // for immediate app exit, closing the connection pool.
        pgPromise.end();
    });
}
exports.insert = insert;
//# sourceMappingURL=model.js.map