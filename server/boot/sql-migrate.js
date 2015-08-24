/**
 * Created by NikCas on 24.08.2015.
 */

module.exports = function(app) {
  app.dataSources.mysqlServerPascal.automigrate('Account');
  app.dataSources.mysqlServerPascal.automigrate('Message');
  app.dataSources.mysqlServerPascal.automigrate('Course');
  app.dataSources.mysqlServerPascal.automigrate('Chat');
};
