let AddressesUserService = require(__base + 'api/addresses-user/services/addresses-user.service');

/**
 * Addresses create page
 */
module.exports.create = function(req, res) {
    res.render('addresses-user/views/create');
}

/**
 * Addresses' list
 */
module.exports.list = function(req, res) {
    res.render('addresses-user/views/list');
}

/**
 * Addresses show page
 */
module.exports.show = function(req, res) {
    AddressesUserService.find(req.params.idAddress, (err, address) => {
        res.render('addresses-user/views/show', { address: address });
    });
}

/**
 * Create GPS address
 */
module.exports.createGPS = function(req, res) {
    res.render('addresses-user/views/createGPS');
}