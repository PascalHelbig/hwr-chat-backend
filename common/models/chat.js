var pubsub = require('../../server/pubsub.js');
var loopback = require('loopback');

module.exports = function(Chat) {
  //Chat after save..
  Chat.observe('after save', function (ctx, next) {
    var socket = Chat.app.io;
    if(ctx.isNewInstance){
      //Now publishing the data..
      pubsub.publish(socket, {
        collectionName : 'Chat',
        data: ctx.instance,
        method: 'POST'
      });
    }else{
      //Now publishing the data..
      pubsub.publish(socket, {
        collectionName : 'Chat',
        data: ctx.instance,
        modelId: ctx.instance.id,
        method: 'PUT'
      });
    }
    //Calling the next middleware..
    next();
  }); //after save..
  //ChatDetail before delete..
  Chat.observe("before delete", function(ctx, next){
    var socket = Chat.app.io;
    //Now publishing the data..
    pubsub.publish(socket, {
      collectionName : 'Chat',
      data: ctx.instance.id,
      modelId: ctx.instance.id,
      method: 'DELETE'
    });
    //move to next middleware..
    next();
  });
};
