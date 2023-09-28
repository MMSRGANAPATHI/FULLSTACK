var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path'); // Add this line

var admin = require("firebase-admin");

var serviceAccount = require("./dbkey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

var app = express(); // Change this line

// Add this middleware to serve static files
app.use(express.static(path.join(__dirname, 'public'))); // Create a directory named 'public' and put your images in there

app.get('/',function(req,res){
  res.sendFile(__dirname+"/demopage.html")
})

app.get("/usersignin.html",function(req,res){
  res.sendFile(__dirname+"/usersignin.html");
})

// Rest of your routes...

// Remove the old app.get for serving images

let socketconnected = new Set()

io.on('connection',onConnected)
    

function onConnected(socket){

    console.log(`a user connected:${socket.id}`);
    socketconnected.add(socket.id)
    io.emit('clients_No',socketconnected.size)
    
    socket.on('disconnect', function () {
       console.log(`a user disconnected:${socket.id}`);
       socketconnected.delete(socket.id)
       io.emit('clients_No',socketconnected.size)
    });
    socket.on('message',(data)=>{
      console.log(data)
      socket.broadcast.emit('chat',data)
    })
    socket.on('feedback',(data)=>{
      socket.broadcast.emit('feedback',data)
    })
}
http.listen(3000, function(){
   console.log('listening on *:3000');
});
