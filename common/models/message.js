module.exports = function (Message) {
  Message.observe('after save', function (ctx, next) {

    if (ctx.isNewInstance) {
      var socket = Message.app.io;
      // Sende Nachricht an ChatId-Room
      socket.to(ctx.instance.chatId).emit('NewMessages', {data: ctx.instance});
    }
    next();
  }); //after save..

};
