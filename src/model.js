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
var guests = {
    update: function (guest, attr, attrValue, done) {
        var key = "id";
        var keyValue = guest.id;
        pg.none("\n                UPDATE guests \n                SET $<attr^> = $<attrValue> \n                WHERE $<key^> = $<keyValue>;", { key: key, keyValue: keyValue, attr: attr, attrValue: attrValue })
            .then(function () {
            console.log("\n                        Successful update of " + attr + " to " + attrValue + " \n                        of guest with " + key + " " + keyValue);
            return done(null, guest);
        })
            .cathc(function (err) {
            console.log("Updating error: ", err);
            return done(new Error("Updating error: " + err));
        })
            .finally(function () {
            // for immediate app exit, closing the connection pool.
            pgPromise.end();
        });
    },
    selectOne: function (key, keyValue, done) {
        pg.oneOrNone("\n                SELECT * \n                FROM guests \n                WHERE $<key^> = $<keyValue>;", { key: key, keyValue: keyValue })
            .then(function (guest) {
            if (guest) {
                console.log("There is a guest with " + key + " " + keyValue);
                return done(null, guest);
            }
            console.log("There is NO guest with " + key + " " + keyValue);
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
    },
    selectMany: function (key, keyValue, done) {
        pg.any("\n                SELECT * \n                FROM guests \n                WHERE $<key^> = $<keyValue>;", { key: key, keyValue: keyValue })
            .then(function (guests) {
            if (guests) {
                console.log("There are guests with " + key + " " + keyValue);
                return done(null, guests);
            }
            console.log("There are NO guests with " + key + " " + keyValue);
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
    },
    insert: function (guest, done) {
        pg.none("\n                INSERT INTO guests ($<this~>) \n                VALUES ($<first_name>, $<last_name>, $<email>, $<user_password>);", guest)
            .then(function () {
            console.log("Successful inserting of " + guest);
            return done(null, guest);
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
};
exports.guests = guests;
var hotels = {
    selectAll: function (done) {
        pg.any("\n                SELECT * \n                FROM hotels;")
            .then(function (hotels) {
            if (hotels) {
                console.log("There are hotels");
                return done(null, hotels);
            }
            console.log("There are NO hotels");
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
    },
    selectMany: function (key, keyValue, done) {
        pg.any("\n                SELECT * \n                FROM guests \n                WHERE $<key^> = $<keyValue>;", { key: key, keyValue: keyValue })
            .then(function (hotels) {
            if (hotels) {
                console.log("There are guests with " + key + " " + keyValue);
                return done(null, hotels);
            }
            console.log("There is NO guests with " + key + " " + keyValue);
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
    },
    selectUnreservedRooms: function (roomRes, done) {
        pg.any("\n                select *\n                from   rooms, room_types, prices, hotels\n                where\n                    rooms.hotel_id  = hotels.id and\n                    room_types.id   = rooms.room_type and\n                    prices.hotel_id = hotels.id and\n                    room_types.id   = prices.room_type_id and\n                    rooms.id not in (           \n                        select distinct r.id\n                        from   rooms as r, room_types as rt, hotels as h, reservations as rs\n                        where\n                            h.city      = $<city>    and\n                            r.hotel_id  = h.id       and\n                            r.room_type = rt.id      and\n                            r.id        = rs.room_id and (\n                                daterange(date $<arrival_date>, date $<departure_date>) * \n                                daterange(rs.arrival_date, rs.departure_date)) <> 'empty')", roomRes)
            .then(function (roomReservs) {
            if (roomReservs.length > 0) {
                console.log("\n                            There are rooms available in " + roomRes.city + "\n                            from " + roomRes.arrival_date + " to " + roomRes.departure_date);
                return done(null, roomReservs);
            }
            console.log("\n                        There are rooms availablee in " + roomRes.city + "\n                        from " + roomRes.arrival_date + " to " + roomRes.departure_date);
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
    pg.none("\n            DELETE $<tableName>\n            WHERE  $<key^> = $<keyValue>;", { tableName: tableName, key: key, keyValue: keyValue })
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
function selectAll(tableName, done) {
    pg.any("\n            SELECT * \n            FROM   $<tableName>;", tableName)
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
function update(key, keyValue, attr, attrValue, done) {
    pg.none("\n                UPDATE guests \n                SET    $<attr^> = $<attrValue> \n                WHERE  $<key^> = $<keyValue>;", { key: key, keyValue: keyValue, attr: attr, attrValue: attrValue })
        .then(function () {
        console.log("\n                        Successful update of " + attr + " to " + attrValue + " \n                        of guest with " + key + " " + keyValue);
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
//# sourceMappingURL=model.js.map