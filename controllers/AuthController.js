var mongoose = require("../databases/user_db");
var passport = require("passport");
var User = require("../models/User");
var Message = require('../models/Message');

var userController = {};

// Restrict access to root page
userController.home = function(req, res) {
  var msg;
  var rec;
  if (req.user == undefined) {
    msg = '';
    rec = '';
    res.render('index', { user : req.user, messages: msg, recieved: rec, queued: undefined });
  } else {
    msg = req.user.messages.slice(req.user.messages.length - 5).reverse();
    rec = req.user.recieved.slice(req.user.recieved.length - 5).reverse();
    queuedMessages(req.user.username)
      .then(function(messages) {
        res.render('index', { user : req.user, messages: msg, recieved: rec, queued: messages.reverse() });
      })
  }
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

function queuedMessages(user) {
  return Message.find({"$and": [{swapped: false}, {posted: user}]});
}

module.exports = userController;