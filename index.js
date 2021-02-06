// Importing modules
import Books from './models/schema.js';
const express = require('express');
const app = express();
const https = require('http').Server(app);
const socketio = require('socket.io')(https);
const mongoose = require('mongoose');
const enforce = require('express-sslify');
//
app.get('/', (req, res) => {
  res.send("Https test!!");
});
app.use(enforce.HTTPS());
// Creating a promise, and message model for mongoose
mongoose.Promise = Promise;
const dbUrl = 'mongodb+srv://v01d13:wFYQrplPbOqDf6tG@chat-app-mongo.dqlry.mongodb.net/<dbname>?retryWrites=true&w=majority';
const Message = new Books();
// Socket connection on connected
socketio.on('connection',  async (socket) => {
  console.log('User connected');
  //Placeholder for unseen messages
  await Message.find({username: "Suresh"}, (err, messages) => {
    if (err)
      return console.error(err);
    else
      try {
        var json_parse = JSON.stringify(messages);
        socket.emit("initial_message", json_parse);
      }
      catch (err) {
        console.error(err);
      }
    }).lean().exec();
});
// Socket connection error
socketio.on('clientError', (err, socket) => {
  console.error(err);
  socketio.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
// Socket on disconnect
socketio.on('disconnect', (client) => {
  socketio[client].disconnect();
  console.log(`User disconnected`);
});
// HTTPS server
https.listen(process.env.PORT || 3000, (req, res) => {
  console.log('Listening: ', https.address());
});
socketio.on('send_message', (data) => {
  console.log(data.user);
  console.log(data.message);
  var mongoose_data = new Message({username: data.user, message: data.message});
  mongoose_data.save( (err) => {
    if(err)
      console.error(err);
    else
      console.log('New database entry.');
  });
  socket.broadcast.emit("receive_message", data);
});
// Private message for future//
socketio.on('private_message', async (socket) => {
  app.get(username, (req, res) => {
    await Message.find({username: "Suresh"}, (err, messages) => {
      if (err)
        return console.error(err);
      else
        try {
          var json_parse = JSON.stringify(messages);
          socket.emit(json_parse);
        }
        catch (err) {
        console.error(err);
        }
    }).lean().exec();
  });
});
// Mongoose connecting to mlab database
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err)
    console.log(err);
  else
    console.log('Database connected')
});