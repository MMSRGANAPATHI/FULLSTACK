const express = require('express');
var admin = require("firebase-admin");
var sac = require("./dbkey.json");
admin.initializeApp({
    credential: admin.credential.cert(sac)
});
const db = admin.firestore();
const app = express();

app.get("/signup", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.get("/signupsubmit", (req, res) => {
    db.collection("details").add({
        name: req.query.uname,
        email: req.query.email,
        password: req.query.password
    }).then(() => {
        res.sendFile(__dirname + "/login.html");
    });
});

app.get("/loginsubmit", (req, res) => {
    const username = req.query.username;
    const password = req.query.password;

    db.collection('details')
        .where("name", "==", username)
        .where("password", "==", password)
        .get()
        .then((docs) => {
            if (docs.size > 0) {
                res.send("Login successful");
            } else {
                res.send("Login failed");
            }
        })
        .catch((error) => {
            console.error("Login error:", error);
            res.send("An error occurred while trying to log in");
        });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
