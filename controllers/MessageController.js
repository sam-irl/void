var Message = require('../models/Message');
var mongoose = require('../databases/message_db');

var messageController = {};

messageController.addNew = function (req, res) {
    var lastMessage = (Message.find().len ? Message.findOne().sort({ field: -id }).limit(1) : { id: 0 });
    var lastId = (lastMessage.id ? lastMessage.id : 0);
    var newId = lastId + 1;
    var newMsg = new Message({
        content: req.body.content,
        heardCount: 0,
        id: newId,
        posted: req.body.user
    });
    newMsg.save(function (err) {
        res.send(err);
    })
};

messageController.display = function (req, res) {
    res.render('messageSingle', Message.find(req.id, function (err, found) {
        if (err) return 'Could not find the message';
        if (!err) return found;
    }))
};

module.exports = messageController;