var app = require('../../server/server');
module.exports = function(AccountChat) {
  AccountChat.observe('after save', function (ctx, next) {

    if (ctx.isNewInstance) {
      var socket = AccountChat.app.io;
      // Sende an jeweiligen User, dass neuer Chat erstellt wurde
      socket.to('user' + ctx.instance.accountId).emit('NewChat', {chatId: ctx.instance.chatId});

      // Join zu jeder seiner Websocket Verbindungen den neuen Chat-Room
      var room = socket.sockets.adapter.rooms['user' + ctx.instance.accountId];
      if (room) {
        for (var id in room) {
          var socketConnection = socket.sockets.adapter.nsp.connected[id];
          socketConnection.join(ctx.instance.chatId);
        }
      }
    }
    next();
  }); //after save..

  AccountChat.observe('after delete', function(ctx, next) {
    var chatId = ctx.where.chatId;
    if (chatId) {
      AccountChat.count({chatId: chatId}, function(err, count) {
        if (err || count > 0) {
          return next();
        }

        // Wenn kein User mehr im Chat ist kann der Chat (inkl. Messages) gelöscht werden.
        app.models.Chat.destroyById(chatId, function() {
          app.models.Message.destroyAll({chatId: chatId}, function() {
            next();
          });
        });
      });
    } else {
      next();
    }
  }); // after delete...
};
