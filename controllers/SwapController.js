var User = require('../models/User');
var Message = require('../models/Message');

var swapController = {};

swapController.doSwap = function (req, res) {
    getMessage(req.params.id).then(function(msg) {
        if (!msg) { res.render('error', {err: 'Could not find the message passed to the swap controller'}); return; }
        getSwappableMessages(msg.posted).then(function(arr) {
            var msgSwapping;
            if (arr == 0) {
                res.render('swapQueued');
                return;
            }
            msgSwapping = arr[Math.round(Math.random() * arr.length)];
            msg.swapped = true;
            msg.save(function(err, updated) {
                if (err) return err;
            });
            msgSwapping.swapped = true;
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
            res.render('messageSwap', {swapping: msg, swapTo: msgSwapping});
            console.log('done')
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