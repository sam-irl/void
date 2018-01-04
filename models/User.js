var mongoose = require('../databases/user_db');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
    username: {
        type: String,
        validate: {
            validator: function(v, cb) {
              User.find({name: v}, function(err,docs){
                 cb(docs.length == 0);
              });
            },
            message: 'User already exists!'
        }
    },
    password: String,
    level: Number,
    joining: Array,
    messages: Array
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);