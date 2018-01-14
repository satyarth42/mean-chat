var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var socketio = require('socket.io');
var flash = require('connect-flash');
var expressSession = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var io = socketio();
app.io = io;
mongoose.connect('mongodb://127.0.0.1:27017/mean-chat');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(expressSession({
    secret: 'hY797S2APCzSkjhgndFbsngMSd7dy',
    resave: true,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
var use = require('./models/users');
var messages = require('./models/messages');
var onlineUsers = {};
io.on('connection',function(socket){
    socket.on('new_user',function(data){
        onlineUsers[data._id]=socket['id'];
    });
    socket.on('search',function(data){
        var str=data['name']+".*";
        use.find({$or:[{username:{$regex:str,$options:'i'}},{fname:{$regex:str,$options:'i'}},{lname:{$regex:str,$options:'i'}}]},function(err,docs){
            socket.emit('user_list',{docs:docs});
        }).select('-password');
    });
    socket.on('message',function(data){
        var message = new messages({
            "sender":data.sender,
            "receiver":data.receiver,
            "message":data.msg,
        });
        message.save(function(err,updated){
            if(err) console.log(err);
        });
        if(data.receiver in onlineUsers){
            socket.to(onlineUsers[data.receiver]).emit('receive_msg',{data:data});
        }
    });
    socket.on('get_msgs',function(data){
        var snd = data.user1;
        var rcv = data.user2;
        messages.find({$or:[{$and:[{"sender":snd},{"receiver":rcv}]},{$and:[{"sender":rcv},{"receiver":snd}]}]},function (err,data){
            socket.emit('messages',{data:data});
        });
    });
});

module.exports = app;
