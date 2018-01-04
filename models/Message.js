var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    content: String,
    heardCount: Number,
    id: Number,
    posted: Object
});

module.exports = mongoose.model('Message', MessageSchema);