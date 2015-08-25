/**
 * Created by NikCas on 24.08.2015.
 */

module.exports = function(app) {
  app.dataSources.mysqlServerPascal.automigrate('Account', function(err) {
    if (err) throw err;
    app.models.Account.create({email:"test@hwr-berlin.de", password:"1234"});
  });
  app.dataSources.mysqlServerPascal.automigrate('Message');
  app.dataSources.mysqlServerPascal.automigrate('Course');
  app.dataSources.mysqlServerPascal.automigrate('Chat');
  app.dataSources.mysqlServerPascal.automigrate('AccountChat');
};
