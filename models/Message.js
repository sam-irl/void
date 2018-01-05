var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    content: String,
    heardCount: Number,
    id: Number,
    posted: String,
    swapped: Boolean
});

MessageSchema.methods.getId = function () {
    var idNum = this.id ? this.id : 0;
    return idNum;
}

module.exports = mongoose.model('Message', MessageSchema);