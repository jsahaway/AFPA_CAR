let db = require(__base + 'config/db');
let TripFavoriteModel = require('../models/trip_favorite.model');

class TripFavoriteDAO {

    static list(id, cb) {

        console.log("id:", id)

        db.query(`SELECT 
                id_trip_favorite, 
                name,
                nb_seats,
                driver,
                user_id,
                car_user_id,
                address_departure_id,
                address_arrival_id
                FROM trip_favorite
                WHERE user_id != 1`, [id], (err, rows) => {

                rows = rows || [];

                rows = rows.map((row) => {
                    console.log(row)
                    return row;
                });

                cb(err, rows);
            });
    }


    static create(trip, cb) {
        

        db.query(`CALL _PS_create_trip_favorite(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [trip.name, trip.nb_seats, trip.driver, trip.user_id, trip.car_user_id,
            trip.address_departure_id, trip.address_arrival_id,
            trip.lun, trip.mar, trip.mer, trip.jeu, trip.ven, trip.sam, trip.dim],
            (err, rows) => {
                cb(err);
            });

        db.query(`
            SELECT id_trip_favorite 
            FROM trip_favorite
            ORDER BY id_trip_favorite DESC 
            LIMIT 1;`,
            (err, rows) => {
                let idTripFav = rows;
                cb(err);

                db.query('CALL _PS_tripFromFavorite (?, 2)', [idTripFav[0].id_trip_favorite], (err) => {
                    cb(err);
                });
            });
            
    }



    static delete(trip, cb) {
        db.query('DELETE FROM trip_favorite WHERE id_trip_favorite = ?', [trip.id_trip_favorite],
            (err) => {
                cb(err);
            });

    }


    static findByID(id, cb) {

        db.query('SELECT * FROM trip_favorite WHERE id_trip_favorite = ? LIMIT 1', [id], (err, rows) => {
            if (rows[0]) {
                cb(err, new TripFavoriteModel(rows[0]))
            }
            else {
                cb(err, null);
            }
        });
    }

    static findByUserID(id, cb) {

        db.query(`
        ######################################
        ## List of trip_favorite by user_id ##
        ######################################
        
        SELECT id_trip_favorite, name, nb_seats, driver,
        
        dep.street AS depStr, dep.city AS depCity, dep.zip_code AS depZip, dep.numero AS depNum, dep.latitude AS depLat, dep.longitude AS depLng, dep.rep AS depRep, 
        arr.street AS arrStr, arr.city AS arrCity, arr.zip_code AS arrZip, arr.numero AS arrNum, arr.latitude AS arrLat, arr.longitude AS arrLng, arr.rep AS arrRep,
        
        hours_departure, hours_arrival, way_type,
        
        GROUP_CONCAT(day) AS days,

        numimmat, color, model_name, brand_name      
        
        FROM trip_favorite AS tf
        LEFT JOIN address AS dep
        ON tf.address_departure_id = dep.id_address
        LEFT JOIN address AS arr
        ON tf.address_arrival_id = arr.id_address
        
        LEFT JOIN trip_favorite_has_day_week AS tfweek
        ON tf.id_trip_favorite = tfweek.trip_favorite_id
        
        LEFT JOIN day_week AS dweek
        ON tfweek.day_week_id = dweek.id_day_week
        
        LEFT JOIN car_user
        ON tf.car_user_id = car_user.id_car_user
        LEFT JOIN car
        ON car_user.car_id = car.id_car
        LEFT JOIN car_brand
        ON car.car_brand_id = car_brand.id_car_brand
        
        WHERE tf.user_id = ?
        GROUP BY id_trip_favorite
        `, [id], (err, rows) => {

                rows = rows || [];

                if (rows) {
                    rows = rows.map((row) => {


                        return new TripFavoriteModel({
                            id_trip_favorite: row.id_trip_favorite,
                            name: row.name,
                            nb_seats: row.nb_seats,
                            driver: row.driver,
                            days: row.days,

                            tripFavDayRef: {
                                hours_departure: row.hours_departure,
                                hours_arrival: row.hours_arrival,
                                way_type: row.way_type,
                                // dayRef: {
                                //     day: row.day
                                // }
                            },

                            addressDepRef: {
                                street: row.depStr,
                                city: row.depCity,
                                zip_code: row.depZip,
                                numero: row.depNum,
                                latitude: row.depLat,
                                longitude: row.depLng,
                                rep: row.depRep
                            },

                            addressArrRef: {
                                street: row.arrStr,
                                city: row.arrCity,
                                zip_code: row.arrZip,
                                numero: row.arrNum,
                                latitude: row.arrLat,
                                longitude: row.arrLng,
                                rep: row.arrRep
                            },

                            carUserRef: {
                                color: row.color,
                                numimmat: row.numimmat,
                                carRef: {
                                    model_name: row.model_name,
                                    brandRef: {
                                        brand_name: row.brand_name
                                    }
                                }
                            }

                        });

                    });
                    cb(err, rows);
                }
                else {
                    cb(err, null);
                }

            });
    }
}

module.exports = TripFavoriteDAO;