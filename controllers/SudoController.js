var Message = require('../models/Message');
var User = require('../models/User');

var sudoController = {};

sudoController.saveNewMessage = function (req, res) {
    if (req.user == undefined || !req.user.admin) {
        res.render('error', {user: req.user, err: 'Couldn\'t authenticate request'});
    }
    var from;
    var to;
    User.findOne({username: req.body.userFrom})
        .then(function (user) {
            if (user == 0) {
                from = 'void_admin';
            } else {
                from = user;
            }
            User.findOne({username: req.body.userTo})
            .then(function (user) {
                to = user;
                var msg = new Message({
                    content: req.body.content,
                    posted: from,
                    swapped: !req.body.swappable,
                    swappedTo: (!req.body.swappable ? (to == undefined ? to : 'nobody') : undefined),
                    global: req.body.global,
                    id: Message.find({}).sort({id: -1}).then(function (arr) { return arr[0].id + 1; })
                });
                console.log(msg)
                msg.save(function (err) { if (err) res.render('error', {err: err})});
                User.find({}).then(function(users) {
                    if (req.user.global) {
                        for (user in users) {
                            user.recieved.push(msg);
                            user.save(function(err) { if (err) res.render('error', {err: err, user: req.user})});
                        }
                    }
                });

                res.redirect('/');
            });
        });
}

sudoController.displayForm = function (req, res) {
    if (req.user == undefined || !req.user.admin) {
        res.render('error', {user: req.user, err: 'Couldn\'t authenticate request'});
    }
    res.render('sudo', {user: req.user});
}

module.exports = sudoController;