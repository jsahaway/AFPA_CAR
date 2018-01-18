let CarsUserService = require('../services/cars-user.service');
let CarUserModel = require('../models/car-user.model');

/**
 * List CarsUser for current user
 */
module.exports.list = function(req, res) {
  CarsUserService.listByUserID(req.session.user.id, (err, carsUser) => {
    res.json(carsUser);
  });
}

/**
 * CarUserByID for current user middleware (AND ONLY FOR CURRENT USER)
 */
module.exports.carUserByID = function (req, res, next, id) {
  if (isNaN(id)) {
    return res.status(400).send({
      car: 'carUser is invalid'
    });
  }

  CarsUserService.find(id, (err, carUser) => {
    if (!carUser) {
      return next(new Error('Failed to load carUser ' + id));
    }
  
    if (req.session.user.id == carUser.user.id) {
      req.carUser = carUser;
    }

    next();
  });
}