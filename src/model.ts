/// <reference path="../typings/index.d.ts" />

import * as bluebirdPromise from 'bluebird'

const pgPromiseOptions = { promiseLib: bluebirdPromise }
const postgresPromise = require('pg-promise')
const pgMonitor = require("pg-monitor");
const pgPromise = postgresPromise(pgPromiseOptions);
pgMonitor.attach(pgPromiseOptions)
const pg = pgPromise({
    host: 'localhost',
    port: 5433,
    database: 'hot_man_sys',
    user: 'hot_man_sys',
    password: 'hot_man_sys'
});

const qrm = pgPromise.queryResult

import { Guest, Hotel } from './models/schemas/schemas'

const guests = {

    update: (guest: Guest, attr: string, attrValue: string, done) => {

        let key = `id`
        let keyValue = guest.id
        
        console.log(pgPromise.as.format(`
                UPDATE guests 
                SET $<attr^> = $<attrValue> 
                WHERE $<key^> = $<keyValue>;`, 
                { key, keyValue, attr, attrValue }))

        pg.none(`
                UPDATE guests 
                SET $<attr^> = $<attrValue> 
                WHERE $<key^> = $<keyValue>;`, 
                { key, keyValue, attr, attrValue })
            .then(() => {
                console.log(`
                        Successful update of ${attr} to ${attrValue} 
                        of guest with ${key} ${keyValue}`)
                return done(null, guest)
            })
            .cathc((err) => {
                console.log(`Updating error: `, err)
                return done(new Error(`Updating error: ${err}`))
            })
            .finally(() => {
                // for immediate app exit, closing the connection pool.
                pgPromise.end()
            })
    },

    selectOne: (key: string, keyValue: string | number, done) => {

        console.log(pgPromise.as.format(`
                SELECT * 
                FROM guests 
                WHERE $<key^> = $<keyValue>;`, 
                { key, keyValue }))

        pg.oneOrNone(`
                SELECT * 
                FROM guests 
                WHERE $<key^> = $<keyValue>;`, 
                { key, keyValue })
            .then((guest: Guest) => {
                if (guest) {
                    console.log(`There is a guest with ${key} ${keyValue}`)
                    return done(null, guest)
                }
                console.log(`There is NO guest with ${key} ${keyValue}`)
                return done(null, false)
            })
            .catch((err) => {
                console.log(`Querying error: `, err)
                return done(new Error(`Querying error: ${err}`))
            })
            .finally(() => {
                // for immediate app exit, closing the connection pool.
                pgPromise.end()
            })
    },

    selectMany: (key: string, keyValue: string | number, done) => {

        console.log(pgPromise.as.format(`
                SELECT * 
                FROM guests 
                WHERE $<key^> = $<keyValue>;`, 
                { key, keyValue }))

        pg.any(`
                SELECT * 
                FROM guests 
                WHERE $<key^> = $<keyValue>;`, 
                { key, keyValue })
            .then((guests: Guest[]) => {
                if (guests) {
                    console.log(`There are guests with ${key} ${keyValue}`)
                    return done(null, guests)
                }
                console.log(`There are NO guests with ${key} ${keyValue}`)
                return done(null, false)
            })
            .catch((err) => {
                console.log(`Querying error: `, err)
                return done(new Error(`Querying error: ${err}`))
            })
            .finally(() => {
                // for immediate app exit, closing the connection pool.
                pgPromise.end()
            })
    },

    insert: (guest: Guest, done) => {

        let key = `id`
        let keyValue = guest.id

        console.log(pgPromise.as.format(`
                INSERT INTO guests ($<this~>) 
                VALUES ($<first_name>, $<last_name>, $<email>, $<guest_password>);`,
                guest))

        pg.none(`
                INSERT INTO guests ($<this~>) 
                VALUES ($<first_name>, $<last_name>, $<email>, $<guest_password>);`, 
                guest)
            .then(() => {
                console.log(`Successful inserting of ${guest}`);
                return done(null, guest)
            })
            .catch((err) => {
                console.log("Inserting error: ", err);
                return done(new Error(`Inserting error: ${err}`))
            })
            .finally(() => {
                // for immediate app exit, closing the connection pool.
                pgPromise.end(); 
            });
    }
}

const hotels = {

    selectCities: (done) => {
        
        console.log(pgPromise.as.format(`
                SELECT UNIQUE city 
                FROM hotels;`))

        pg.any(`
                SELECT UNIQUE city 
                FROM hotels;`)
            .then((cities) => {
                if (cities) {
                    console.log(`There are cities`)
                    return done(null, cities)
                }
                console.log(`There are NO cities`)
                return done(null, false)
            })
            .catch((err) => {
                console.log(`Querying error: `, err)
                return done(new Error(`Querying error: ${err}`))
            })
            .finally(() => {
                // for immediate app exit, closing the connection pool.
                pgPromise.end()
            })
    },

    selectAll: (done) => {

        console.log(pgPromise.as.format(`
                SELECT * 
                FROM hotels;`))

        pg.any(`
                SELECT * 
                FROM hotels;`)
            .then((hotels: Hotel[]) => {
                if (hotels) {
                    console.log(`There are hotels`)
                    return done(null, hotels)
                }
                console.log(`There are NO hotels`)
                return done(null, false)
            })
            .catch((err) => {
                console.log(`Querying error: `, err)
                return done(new Error(`Querying error: ${err}`))
            })
            .finally(() => {
                // for immediate app exit, closing the connection pool.
                pgPromise.end()
            })
    },

    selectMany: (key: string, keyValue: string | number, done) => {

        console.log(pgPromise.as.format(`
                SELECT * 
                FROM guests 
                WHERE $<key^> = $<keyValue>;`, 
                { key, keyValue }))

        pg.any(`
                SELECT * 
                FROM guests 
                WHERE $<key^> = $<keyValue>;`, 
                { key, keyValue })
            .then((hotels: Hotel[]) => {
                if (hotels) {
                    console.log(`There are guests with ${key} ${keyValue}`)
                    return done(null, hotels)
                }
                console.log(`There is NO guests with ${key} ${keyValue}`)
                return done(null, false)
            })
            .catch((err) => {
                console.log(`Querying error: `, err)
                return done(new Error(`Querying error: ${err}`))
            })
            .finally(() => {
                // for immediate app exit, closing the connection pool.
                pgPromise.end()
            })
    }
}

export { guests, hotels }