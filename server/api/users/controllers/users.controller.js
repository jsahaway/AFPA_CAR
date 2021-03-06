//=========================================================================
// Le controleur fait le lien entre la vue et le service, il controle la
// validité des entrés utilisateurs, passe le traitement au service puis
// rends la vue (typiquement).
//=========================================================================

let UsersService = require('../services/users.service');
let UsersAuthService = require('../services/users.auth.service');
let UsersRegisterService = require('../services/users.register.service');
let UserModel = require('../models/user.model');


/**
 * Authentication a user
 */
module.exports.auth = function(req, res) {
  req.checkBody('email', 'Adresse email invalide').isEmail();
  req.checkBody('password', 'Mot de passe vide').notEmpty();

  let errorsFields = req.validationErrors();

  if (errorsFields) {
    return res.status(500).json({'errors': errorsFields});
  }

  UsersAuthService.checkAccount(req.body.email, req.body.password, (err, user) => {
    if (err) {
      res.status(500).json({'errors': [{msg: 'Connection failed !'}]});
    }
    else {
      req.session.user = user; //## Récupération des valeurs de la table "user"
      res.json({ 'success': [{msg: 'User connected !'}], 'user': user });
    }
  });
}


/**
 * Create a user
 */
module.exports.create = function(req, res) {
  req.checkBody('lastname', 'Nom vide').notEmpty();
  req.checkBody('firstname', 'Prenom vide').notEmpty();
  req.checkBody('login', 'Nom utilisateur vide').notEmpty();
  req.checkBody('email', 'Adresse email invalide').isEmail();
  req.checkBody('password', 'Mot de passe vide').notEmpty();
  req.checkBody('passwordConfirmation', 'Le mot de passe de confirmation doit etre identique au mot de passe')
    .notEmpty()
    .matches(req.body.password);

  let errorsFields = req.validationErrors();

  if (errorsFields) {
    return res.status(500).json({'errors': errorsFields});
  }

  let userModel = new UserModel({
    lastname: req.body.lastname,
    firstname: req.body.firstname,
    login: req.body.login,
    email: req.body.email,
    password: req.body.password
  });

  if (!userModel.isValid()) {
    return res.status(500).json({ 'error': 'Failed to create user, missing fields !' });
  }

  UsersRegisterService.register(userModel, (err, user) => {
    if (err) {
      res.status(500).json({'errors': [{msg: 'Registration failed !'}]});
    } else {
      res.json({ 'success': [{msg: 'User created !'}], 'user': user });
    }
  });
}


/**
 * Read a user
 */
module.exports.read = function(req, res) {
  res.json(req.user);
}


/**
 * Update a user
 */
module.exports.update = function(req, res) {
  req.checkBody('lastname', 'Nom vide').notEmpty();
  req.checkBody('firstname', 'Prenom vide').notEmpty();
  req.checkBody('gender', 'Sexe vide').notEmpty();
  req.checkBody('birthday', 'Date de naissance vide').notEmpty();
  req.checkBody('mobile', 'Mobile vide').notEmpty();
  req.checkBody('login', 'Nom utilisateur vide').notEmpty();
  req.checkBody('email', 'Email vide').isEmail();
  req.checkBody('formation', 'Formation vide').notEmpty();

  let errorsFields = req.validationErrors();

  if (errorsFields) {
    return res.status(500).json({'errors': errorsFields});
  }

  let userModel = new UserModel({
    lastname: req.body.lastname,
    firstname: req.body.firstname,
    gender: req.body.gender,
    birthday: req.body.birthday,
    mobile_phone: req.body.mobile,
    login: req.body.login,
    email: req.body.email,
    formation_id: req.body.formation
  });

  if (!userModel.isValid()) {
    return res.status(500).json({ 'errors': [{msg: 'Failed to update user !'}] });
  }

  userModel.id = req.params.idUser;

  UsersService.update(userModel, (err, user) => {
    if (err) {
      res.status(500).json({ 'errors': [{msg: 'Failed to update user !'}] });
    } else {
      req.session.user = user;
      res.json({ 'success': [{msg: 'User Updated !'}], 'user': user });
    }
  });
}


/**
 * Delete a user
 */
module.exports.delete = function(req, res) {
  UsersService.delete(req.user.id, (err, user) => {
    if (err) {
      res.status(500).json({ 'error': 'Failed to delete user !' });
    } else {
      res.json({ 'success': 'User deleted !', 'user': user });
    }
  });
}


/**
 * List of users
 */
module.exports.list = function(req, res) {
  UsersService.list((err, users) => {
    res.json(users);
  });
}


/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  if (isNaN(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  UsersService.findById(id, (err, user) => {
    if (!user) {
      return next(new Error('Failed to load user ' + id));
    }

    req.user = user;
    next();
  });
};