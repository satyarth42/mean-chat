var mongoose = require('mongoose');
var schema = mongoose.Schema;
var messages = new schema({
    "sender":{
        type:String,
        required:true
    },
    "receiver":{
        type:String,
        required:true
    },
    "message":{
        type:String
    }
},{collection:'messages'});

module.exports = mongoose.model('messages',messages);