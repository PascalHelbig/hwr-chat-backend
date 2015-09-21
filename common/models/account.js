module.exports = function(Account) {

  Account.validatePw = function (id, password, cb) {
    // Suche den Account mit der id
    Account.findById(id, function (err, account) {
      if (err) {
        return cb(err);
      }
      // Wenn Account ist null, dann Fehler Account nicht gefunden:
      if (account === null) {
        return cb('account not found');
      }

      // Überprüfe das Passwort
      account.hasPassword(password, function (err, value) {
        if (err) {
          return cb(err);
        }
        cb(null, value);
      });
    });
  };

  Account.remoteMethod(
    'validatePw',
    {
      accepts: [
        {arg: 'id', type: 'any'},
        {arg: 'password', type: 'string'}
      ],
      http: {
        path: '/validatePassword'
      },
      returns: {arg: 'result', type: 'boolean'}
    }
  );
};
