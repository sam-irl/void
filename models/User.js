var mongoose = require('../databases/user_db');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
    username: String,
    password: String,
    level: Number,
    joining: Array,
    messages: Array,
    recieved: Array
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);