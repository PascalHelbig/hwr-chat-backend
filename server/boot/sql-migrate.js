/**
 * Created by NikCas on 24.08.2015.
 */

module.exports = function(app) {
  var async = require('async');

  app.dataSources.mysqlServerPascal.automigrate([
    'Account',
    'Message',
    'Course',
    'Chat',
    'AccountChat'
  ], function(err) {
    if (err) throw err;
    app.models.Course.create({name: "Informatik"}, function(err, course) {
      if (err) throw err;
      async.parallel([
        function(callback) {
          app.models.Account.create({email:"test@hwr-berlin.de", password:"1234", firstname:"Test", lastname: "User", courseId: course.id}, callback);
        },
        function(callback) {
          app.models.Account.create({email:"test2@hwr-berlin.de", password:"1234", firstname:"Test2", lastname: "User2", courseId: course.id}, callback);
        },
        function(callback) {
          app.models.Chat.create({name: "Gruppenchat 1"}, callback);
        }
      ], function(err, result) {
        if (err) throw err;
        user1 = result[0];
        user2 = result[1];
        chat = result[2];
        app.models.AccountChat.create({accountId: user1.id, chatId: chat.id});
        app.models.AccountChat.create({accountId: user2.id, chatId: chat.id});
        app.models.Message.create({accountId: user1.id, chatId: chat.id, content: "Ich bin User 1 :)"});
        app.models.Message.create({accountId: user2.id, chatId: chat.id, content: "Ich bin User 2 :p"});
      });
    });
  });
};
