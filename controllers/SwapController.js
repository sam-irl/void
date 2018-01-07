var User = require('../models/User');
var Message = require('../models/Message');

var swapController = {};

swapController.doSwap = function (req, res) {
    getMessage(req.params.id).then(function(msg) {
        if (!msg) { res.render('error', {err: 'Could not find the message passed to the swap controller', user: req.user}); return; }
        getSwappableMessages(msg.posted).then(function(arr) {
            var msgSwapping;
            if (arr == 0) {
                res.render('swapQueued');
                return;
            }
            msgSwapping = arr[Math.round(Math.random() * (arr.length - 1))];
            msg.swapped = true;
            msg.swappedTo = msgSwapping.posted;
            msg.save(function(err, updated) {
                if (err) return err;
            });
            msgSwapping.swapped = true;
            msgSwapping.swappedTo = msg.posted;
            msgSwapping.save(function(err, updated) {
                if (err) return err;
            });
            getUser(msg.posted).then(function (user) {
                user.recieved.push(msgSwapping);
                user.save(function(err, updated) { if (err) return err; });
            });
            getUser(msgSwapping.posted).then(function(user) {
                user.recieved.push(msg);
                user.save(function(err, updated) { if (err) return err; });
            });
            res.render('messageSwap', {swapping: msg, swapTo: msgSwapping, user: req.user});
        });
    });
}

function getMessage(id) {
    return Message.findOne({id: id});
}
function getSwappableMessages(user) {
    return Message.find({swapped: false, posted: { "$ne": user }});
}
function getUser(name) {
    return User.findOne({username: name});
}

module.exports = swapController;