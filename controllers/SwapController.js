var User = require('../models/User');
var Message = require('../models/Message');

var swapController = {};

swapController.doSwap = function (req, res) {
    getInitialMessage(req.params.id).then(function(msg) {
        if (!msg) res.render('error', {err: 'Could not find the message passed to the swap controller'});
    })
}

function getInitialMessage(id) {
    return Message.findOne({id: id});
}

module.exports = swapController;