const express = require('express');
const app = express();
const path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var admin = require("firebase-admin");

var serviceAccount = require("./dbkey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
app.use(express.static(path.join(__dirname, 'public')));
app.get('/',function(req,res){
  res.sendFile(__dirname+'/demopage.html')
})


app.get("/usersignin.html",function(req,res){
  res.sendFile(__dirname+'/usersignin.html');
})

//db connec
app.get("/signupsubmit",function(req,res){
  db.collection("details").add({
      name:req.query.uname,
      email:req.query.email,
      password:req.query.password
  }).then(()=>{
    res.redirect('/userLogin.html')
  }).catch((err)=>{
    res.send("failed to sign up");
  })
})
app.get("/userLogin.html",function(req,res){
  res.sendFile(__dirname+'/userLogin.html')
})

app.get("/loginsubmit",function(req,res){
  db.collection('details')
  .where("name" ,"==" ,req.query.username)
  .where("password" ,"==",req.query.password)
  .get()
  .then((docs)=>{
      if(docs.size>0){
          res.redirect('/chat');
      }
      else{
          res.send("failed")
      }
      
  })
})

app.get("/chat", (req, res) => {
  res.sendFile(__dirname+'/index.html');
});





// app.get('/', function(req, res){
//    res.sendFile(__dirname+'/index.html');
// });

let socketconnected = new Set()

io.on('connection',onConnected)
    

function onConnected(socket){

    console.log(`a user connected:${socket.id}`);
    socketconnected.add(socket.id)
    io.emit('clients_No',socketconnected.size)
    //Whenever someone disconnects this piece of code executed
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