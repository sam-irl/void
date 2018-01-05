var User = require('../models/User');
var Message = require('../models/Message');

var swapController = {};

swapController.doSwap = function (req, res) {
    getMessage(req.params.id).then(function(msg) {
        if (!msg) res.render('error', {err: 'Could not find the message passed to the swap controller'});
        getAllMessages().then(function(arr) {
            var msgSwapping;
            if (arr == 0) {
                res.render('error', {err: 'There are no messages! Is the database connected?'});
            }
            msgSwapping = arr[Math.random() * arr.length];
            res.render('messageSwap', {swapping: msg, swapTo: msgSwapping});
            msg.swapped = true;
            msgSwapping.swapped = true;
        });
    });
}

function getMessage(id) {
    return Message.findOne({id: id});
}
function getSwappableMessages() {
    return Message.find({swapped: false});
}

module.exports = swapController;