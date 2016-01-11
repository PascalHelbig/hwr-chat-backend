var loopback = require('loopback');
module.exports = function (Chat) {
  Chat.observe('loaded', function filterProperties(ctx, next) {
    // Wenn Chat KEIN Gruppenchat ist
    if (ctx.instance && !ctx.instance.isGroup) {
      // Find Id des aktuellen Accounts:
      var context = loopback.getCurrentContext();
      var user = context && context.get('accessToken');
      var currentUser = user.userId || -1;

      // Finde alle Accounts zu diesem Chat:
      return ctx.instance.__get__accounts(function (err, accounts) {
        if (err) {
          return next();
        }
        for (var i = 0; i < accounts.length; i++) {
          if (accounts[i].id !== currentUser) {
            ctx.instance.name = accounts[i].firstname + " " + accounts[i].lastname;
            ctx.instance.accountId = accounts[i].id;
            return next();
          }
        }
        next();
      });
    }
    next();
  });
};
