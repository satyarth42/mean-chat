var mongoose = require('mongoose');
var schema = mongoose.Schema;
var friends = new schema({
    "user1":{
        type:String,
        required:true
    },
    "user2":{
        type:String,
        required:true
    },
    "status":{
        type:String
    }
},{collection:'friends'});

module.exports = mongoose.model('friends',friends);