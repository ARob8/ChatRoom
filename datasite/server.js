// Retrieve
var MongoClient = require('mongodb').MongoClient,
client = require('socket.io').listen(8080).sockets;

MongoClient.connect('mongodb://127.0.0.1/chat', function(err, db){
  if(err){
    throw err;
  }

client.on('connection', function(socket) {

  var col = db.collection('messages'),
    sendStatus = function(s){
      socket.emit('status', s);
    };
    col.find().limit(100).sort({_id: 1}).toArray(function(err,res) {
        if(err) throw err;
        socket.emit('output',res);
    });

   socket.on('input', function(data){
         var name = data.name,
         message = data.message,
         whitespace = /^\s*$/;

         if(whitespace.test(name) || whitespace.test(message)){
           sendStatus("Name and message are required");
         }else{
           col.insert({name: name, message: message}, function(){
            socket.emit()
             client.emit('output',[data]);
             sendStatus({
                message: "Message sent",
                clear: true
             });

        });
         }
    });
  });
});
