let TripFavoriteDAO = require('../dao/trip_favorite.dao.mysql')

class TripFavoriteService {

    static list(id, cb) {
        return TripFavoriteDAO.list(id, cb);
    }

    static create(args, cb) {
        return TripFavoriteDAO.create(args, cb);
    }

    static delete(args, cb) {
        return TripFavoriteDAO.delete(args, cb);
    }

    static findByID(id, cb) {
        return TripFavoriteDAO.findByID(id, cb);
    }

    static findByUserID(id, cb) {
        return TripFavoriteDAO.findByUserID(id, cb);
    }
}

module.exports = TripFavoriteService;