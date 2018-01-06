var Message = require('../models/Message');
var User = require('../models/User');

var globalController = {};

globalController.doForm = function (req, res) {
    if (req.user == undefined) {
        res.render('error', {err: 'You are not logged in, so you may not view this page'});
        return;
    }
    if (!req.user.admin) {
        res.render('error', {err: 'You do not have permission to view this page'});
        return;
    }
    res.render('globalMsg', {user: req.user});
}

globalController.saveMsg = function (req, res) {
    if (req.user == undefined) {
        res.render('error', {err: 'You are not logged in, so you may not submit a global message'});
        return;
    }
    if (!req.user.admin) {
        res.render('error', {err: 'You do not have permission to submit global messages'});
        return;
    }
    saveMessage(res, req)
        .then(function (msg) {
            getAllUsers().then(function (users) {
                users.forEach(function (user) {
                    user.recieved.push(msg);
                    user.save(function (err, updated) {
                        if (err) return err;
                    });
                });
                res.redirect('/');
            });
        });
}

// TODO: abstract to util class
function saveMessage(res, req) {
    return Message
        .find( {} )
        .sort( { id: -1 } )
        .limit(1)
        .then(function(msgArr) {
            var last;
            if (msgArr == 0) {
                last = 0;
            } else {
                last = msgArr[0].getId();
            }
            var newMsg = new Message({
                id: (last + 1),
                content: req.body.content,
                posted: req.body.user,
                heardCount: 0,
                swapped: true,
                global: true
            });
            newMsg.save(function (err) {
                if (err) res.send(err);
            });
            return newMsg;
        })
        .catch(function (err) {
            return err;
        });
}

function getAllUsers() {
    return User.find( {} );
}

module.exports = globalController;