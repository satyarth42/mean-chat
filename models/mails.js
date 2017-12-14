var mongoose = require('mongoose');
var schema = mongoose.Schema;
var mails = new schema({
    "sender":{
        type:String,
        required:true
    },
    "receiver":{
        type:String,
        required:true
    },
    "subject":{
        type:String
    },
    "content":{
        type:String
    },
    "date":{
        type:Date
    }
},{collection:'emails'});

module.exports = mongoose.model('emails',mails);