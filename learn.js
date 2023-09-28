const express = require('express')
const request = require('request')
var admin = require("firebase-admin"); 
var sac = require("./dbkey.json");
admin.initializeApp({
    credential: admin.credential.cert(sac)
});
const db = admin.firestore();
const app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get("/signup",function(req,res){
    res.sendFile(__dirname+"/signup.html");
})

//db connec
app.get("/signupsubmit",function(req,res){
    db.collection("details").add({
        name:req.query.username,
        email:req.query.email,
        password:req.query.password
    }).then(()=>{
        res.redirect('/login');
        
    })
})
app.get("/login",function(req,res){
    res.sendFile(__dirname+"login.html")
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
    res.sendFile(__dirname + "/index.html");
});

app.listen('4000',function(){
    console.log("hey ,I have started in the file 4000!")
})