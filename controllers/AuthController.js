var mongoose = require("../databases/user_db");
var passport = require("passport");
var User = require("../models/User");

var userController = {};

// Restrict access to root page
userController.home = function(req, res) {
  var msg;
  var rec;
  if (req.user == undefined) {
    msg = '';
    rec = '';
  } else {
    msg = req.user.messages;
    rec = req.user.recieved;
  }
  res.render('index', { user : req.user, messages: msg, recieved: rec });
};

// Go to registration page
userController.register = function(req, res) {
  res.render('register');
};

// Post registration
userController.doRegister = function(req, res) {
  User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
    if (err) {
      res.render('error', {err: 'An error occurred while registering. Does another user have that username?'});
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });
};

// Go to login page
userController.login = function(req, res) {
  res.render('login');
};

// Post login
userController.doLogin = function(req, res) {
  passport.authenticate('local')(req, res, function () {
    res.redirect('/');
  });
};

// logout
userController.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

module.exports = userController;