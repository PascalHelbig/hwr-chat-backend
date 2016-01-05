module.exports = function (app) {
  var Role = app.models.Role;
  Role.registerResolver('chatMember', function (role, context, cb) {
    function reject(err) {
      if (err) {
        return cb(err);
      }
      cb(null, false);
    }

    if (context.modelName !== 'Chat') {
      // the target model is not chat
      return reject();
    }

    var userId = context.accessToken.userId;
    if (!userId) {
      return reject(); // do not allow anonymous user
    }
    // check if userId is in accountChat table for the given chat
    context.model.findById(context.modelId, function (err, chat) {
      if (err || !chat) {
        return reject(err);
      }
      var AccountChat = app.models.AccountChat;
      AccountChat.count({
        chatId: chat.id,
        accountId: userId
      }, function (err, count) {
        if (err) {
          reject(err);
        }
        cb(null, count > 0); // true = is a chat member
      })
    });
  });
};
