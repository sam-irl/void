var Message = require('../models/Message');
var User = require('../models/User');

var messageController = {};

messageController.addNew = function (req, res) {
    saveMessage(res, req)
        .then(function(msg) {
            getUser(msg.posted)
                .then(function(user) {
                    addMessageToUser(user, msg)
                        .then(function(updated) {
                            res.redirect('/swapMsg/' + msg.id);
                        });
                });
        });
};

messageController.displayMessage = function (req, res) {
    getMessage(req.params.id, res)
        .then(function(msg) {
            res.render('messageSingle', {msg: msg});
        });
};


/**
 * Gets the message from the database with the given id.
 * 
 * @param {Number} id 
 * @param {*} res 
 * @return {Message} a promise of the message requested
 */
function getMessage(id, res) {
    return Message
        .findOne({ id: id })
        .then(function(msg) {
            return msg;
        })
        .catch(function (err) {
            res.send(err);
        });
}

/**
 * Saves a message to the database.
 * 
 * @param {*} res 
 * @param {*} req 
 * @return {Message} a promise of the message saved
 */
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
                posted: req.body.posted,
                heardCount: 0
            });
            newMsg.save(function (err) {
                if (err) res.send(err);
            });
        })
        .catch(function (err) {
            return err;
        });
}

/**
 * Adds a given message to the user's `message` property.
 * 
 * @param {User} user 
 * @param {Message} message 
 * @return {User} the updated user (promise)
 */
function addMessageToUser(user, message) {
    user.messages += message;
    user.save(function (err, updated) {
        if (err) return err;
        return updated;
    });
}

function getUser(user) {
    return User.find({username: user});
}

module.exports = messageController;