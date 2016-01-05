var loopback = require('loopback');
module.exports = function (Message) {

  // Vor dem Speichern der Nachricht, setzte accountId auf den angemeldeten User
  Message.observe('before save', function (ctx, next) {
    var context = loopback.getCurrentContext();
    var user = context && context.get('accessToken');

    if (user) {
      ctx.instance.accountId = user.userId;
    }
    next();
  });

  Message.observe('after save', function (ctx, next) {

    if (ctx.isNewInstance) {
      var socket = Message.app.io;
      // Sende Nachricht an ChatId-Room
      socket.to(ctx.instance.chatId).emit('NewMessages', {data: ctx.instance});
    }
    next();
  }); //after save..

};
