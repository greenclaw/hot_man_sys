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

import { Guest, Hotel, Room, RoomType, Reservation } from './models/schemas/schemas'

export interface RoomReservation extends Hotel, Room, RoomType, Reservation {}

const hotels = {

  selectUnreservedRooms: (roomRes: RoomReservation, done) => {

    pg.any(`
        select *
        from   rooms, room_types, prices, hotels
        where
          rooms.hotel_id  = hotels.id           and
          room_types.id   = rooms.room_type     and
          prices.hotel_id = hotels.id           and
          room_types.id   = prices.room_type_id and
          rooms.id not in (
            select distinct r.id
            from   rooms as r, room_types as rt, hotels as h, reservations as rs
            where
              h.city      = $<city>    and
              r.hotel_id  = h.id       and
              r.room_type = rt.id      and
              r.id        = rs.room_id and (
                daterange(date $<arrival_date>, date $<departure_date>) * 
                daterange(rs.arrival_date, rs.departure_date)) <> 'empty')`, 
        roomRes)
      .then((roomReservs: RoomReservation[]) => {
        if (roomReservs.length > 0) {
          console.log(`
              There are rooms available in ${roomRes.city}
              from ${roomRes.arrival_date} 
              to   ${roomRes.departure_date}`)
          return done(null, roomReservs)
        }
        console.log(`
            There are rooms availablee in ${roomRes.city}
            from ${roomRes.arrival_date} 
            to   ${roomRes.departure_date}`)
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

export function del(tableName: string, key: string, 
    keyValue: string | number, done): void {

  pg.none(`
      DELETE $<tableName>
      WHERE  $<key^> = $<keyValue>;`,
      { tableName, key, keyValue })
    .then(() => {
      console.log(`Tuples with ${key} ${keyValue} deleted from ${tableName}`)
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

export function selectOne(tableName: string, key: string, 
    keyValue: string | number, done) {

  pg.oneOrNone(`
      SELECT * 
      FROM   $<tableName^>
      WHERE  $<key^> = $<keyValue>;`, 
      { tableName, key, keyValue })
    .then((tuple: any) => {
      if (tuple) {
        console.log(`
            There is a tuple with ${key} ${keyValue} 
            in ${tableName}`)
        return done(null, tuple)
      }
      console.log(`
          There is NO tuple with ${key} ${keyValue} 
          in ${tableName}`)
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

export function selectMany(tableName: string, key: string, keyValue: string | number, done) {

  pg.any(`
      SELECT * 
      FROM   $<tableName> 
      WHERE  $<key^> = $<keyValue>;`, 
      { key, keyValue })
    .then((tuples: any[]) => {
      if (tuples.length > 0) {
        console.log(`
            There are tuples with ${key} ${keyValue} 
            in ${tableName}`)
        return done(null, tuples)
      }
      console.log(`
          There are NO tuples with ${key} ${keyValue} 
          in ${tableName}`)
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

export function selectAll(tableName: string, done): void {

  pg.any(`
      SELECT * 
      FROM   $<tableName^>;`,
      { tableName })
    .then((tuples: any[]) => {
      if (tuples.length > 0) {
        console.log(`There are tuples in ${tableName}`)
        return done(null, tuples)
      }
      console.log(`There are NO tuples in ${tableName}`)
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

export function update(tableName: string, key: string, 
    keyValue: string | number, attr: string, attrValue: string, done) {

  pg.none(`
      UPDATE $<tableName^> 
      SET    $<attr^> = $<attrValue> 
      WHERE  $<key^>  = $<keyValue>;`, 
      { tableName, key, keyValue, attr, attrValue })
    .then(() => {
      console.log(`
          Successful update of ${attr} to ${attrValue} 
          of tuples with ${key} ${keyValue}`)
      return done(null, true)
    })
    .cathc((err) => {
      console.log(`Updating error: `, err)
      return done(new Error(`Updating error: ${err}`))
    })
    .finally(() => {
      // for immediate app exit, closing the connection pool.
      pgPromise.end()
    })
}

export function insert(tableName, attrs: string[], vals: Array<number | string> , done) {

  pg.none(`
      INSERT INTO $<tableName^> ($<attrs^>) 
      VALUES ($<vals^>);`, 
      { 
        tableName, 
        attrs: attrs.map(pgPromise.as.name).join(),
        vals:  vals.map(val => {
          if (typeof val === `number`) return val
          return `'` + val + `'`
        }).join(`, `)
      })
    .then(() => {
      console.log(`Successful inserting of ${vals} to ${attrs} in ${tableName}`);
      return done(null, true)
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

export { hotels }