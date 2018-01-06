var Message = require('../models/Message');
var User = require('../models/User');
var passport = require('passport');

var messageController = {};

messageController.addNew = function (req, res) {
    if (!req.body.content || !req.body.user) {
        res.render('error', {err: 'Request had an empty user and/or content field'});
    }
    if (!req.user || (!req.user.username === req.body.user)) {
        res.render('error', {err: 'Couldn\'t submit message: could not authenticate your username!'});
        return;
    }
    saveMessage(res, req)
        .then(function(msg) {
            getUser(msg.posted)
                .then(function(user) {
                    addMessageToUser(user, msg);
                    res.redirect('/swapMsg/' + msg.id);
                });
        });
};

messageController.seeAll = function (req, res) {
    if (req.user == undefined) {
        function allMessages() {
            return Message.find({});
        };
        allMessages().then(function(msg) {
            res.render('allMessages', {messages: msg});
        });
    } else {
        function userMessages() {
            return Message.find({posted: req.user.username});
        };
        function userRecieved() {
            return Message.find({"$or": [{swappedTo: req.user.username}, {global: true}]});
        };
        function otherMessages() {
            return Message.find({"$and": [{posted: {"$ne": req.user.username}}, {"$or": [{swappedTo: {"$ne": req.user.username}}, {swapped: false}]}, {"$or": [{global: false}, {global: undefined}]}]});
        };
        userMessages().then(function(userMsg) {userRecieved().then(function(userRec) { otherMessages().then(function (otherMsg) {
            res.render('allMessages', {user: req.user, userMsg: userMsg, userRec: userRec, otherMsg: otherMsg, messages: ''});
        })})});
    }
};

messageController.getOwnSent = function (req, res) {
    if (req.user == undefined) {
        res.render('error', {err: 'You must be logged in to view your messages.'});
    }
    res.render('messageList', {user: req.user});
};

messageController.getOwnRecieved = function (req, res) {
    if (req.user == undefined) {
        res.render('error', {err: 'You must be logged in to view your recieved messages.'});
    }
    res.render('messageList', {user: req.user, recieved: ' Recieved'});
};

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
                posted: req.body.user,
                heardCount: 0,
                swapped: false
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

/**
 * Adds a given message to the user's `message` property.
 * 
 * @param {User} user 
 * @param {Message} message 
 * @return {User} the updated user (promise)
 */
function addMessageToUser(user, message) {
    user.messages.push(message);
    user.save(function (err, updated) {
        if (err) return err;
    });
    return message;
}

function getUser(user) {
    return User.findOne({username: user});
}

module.exports = messageController;