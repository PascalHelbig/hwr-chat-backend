var app = require('../../server/server');
module.exports = function (AccountChat) {
  AccountChat.observe('before save', function (ctx, next) {
    if (ctx.isNewInstance) {
      app.models.Chat.findOne(ctx.chatId).then(function (err, chat) {
        if (err) {
          return next();
        }
        // Wenn der Chat keine Gruppe ist ...
        if (!chat.isGroup) {
          return AccountChat.count({chatId: chat.id}, function (err, count) {
            // ... und schon zwei Accounts im Chat sind ...
            if (count >= 2) {
              return next(new Error("Chat ist kein Gruppenchat")); // ... dann gib Fehlermeldung
            }
            next();
          });
        }
        next();
      });
    }
  }); // before save

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

  AccountChat.observe('after delete', function (ctx, next) {
    var chatId = ctx.where.chatId;
    if (chatId) {
      AccountChat.count({chatId: chatId}, function (err, count) {
        if (err || count > 0) {
          return next();
        }

        // Wenn kein User mehr im Chat ist kann der Chat (inkl. Messages) gelöscht werden.
        app.models.Chat.destroyById(chatId, function () {
          app.models.Message.destroyAll({chatId: chatId}, function () {
            next();
          });
        });
      });
    } else {
      next();
    }
  }); // after delete...
};
