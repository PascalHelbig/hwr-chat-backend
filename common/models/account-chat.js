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
};
