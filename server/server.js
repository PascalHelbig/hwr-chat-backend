var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.start = function () {
  // start the web server
  return app.listen(function () {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module) {
    //app.start();
    //socket.io
    app.io = require('socket.io')(app.start());
    require('socketio-auth')(app.io, {
      authenticate: function (socket, value, callback) {
        var AccessToken = app.models.AccessToken;
        //get credentials sent by the client
        AccessToken.find({
          where: {
            and: [{userId: value.userId}, {id: value.id}]
          }
        }, function (err, tokenDetail) {
          if (err) throw err;
          if (tokenDetail.length) {
            callback(null, true);
            var AccountChat = app.models.AccountChat;
            AccountChat.find({where: {accountId: value.userId}}, function (err, chats) {
              if (err) throw err;
              for (var i = 0; i < chats.length; i++) {
                socket.join(chats[i].chatId);
                console.log(value.userId + ' joined chat ' + chats[i].chatId);
              }
            });
          } else {
            callback(null, false);
          }
        }); //find function..
      } //authenticate function..
    });

    app.io.on('connection', function (socket) {
      console.log('a user connected');
      socket.on('disconnect', function () {
        console.log('user disconnected');
      });
    });
  }
});
