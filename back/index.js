let bodyParser = require("body-parser");
let express = require("express");
let mysql = require("mysql");
let mail = require("nodemailer");
let md5 = require("md5");

// Routes
var user = require("./user");
var users = require("./users");

var app = express();

// friend_solicitude.status = 0 Pending
// friend_solicitude.status = 1 Accepted
// friend_solicitude.status = 2 Denied

// likesPhotos.type = cat Cat
// likesPhotos.type = dog Dog

// MySql config
var conn = mysql.createConnection({
    host: "104.197.82.238",
    user: "dogs_cats",
    password: "doggos_cattos",
    database: "dogs_cats"
});
conn.connect(function(err){
    if(err) throw err;
    console.log("Mysql module connected!");
});

// Body parser config
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.listen(6969, function(e){
    console.log(e);
    console.log("Server ON");
});



var functionBundle = function(){
    var publics = {};
    publics.clog = function(...args){
        console.log("I: ",args)
    };
    publics.cerr = function(...args){
        console.log("E: ", args);
    };
    publics.cwar = function(...args){
        console.log("W: ", args);
    }
    return publics;
}();

var processErrorStatus = function(res){
    res.statusMessage = "Error";
    res.status(500);
}

var inputErrorStatus = function(res){
    res.statusMessage = "Bad input";
    res.status(400);
}


var obj = {mysql: conn, mailer: mail, l: functionBundle, md5: md5, 
    processErrorStatus: processErrorStatus, inputErrorStatus: inputErrorStatus};

app.use("/user", user(express.Router(), obj));
app.use("/users", users(express.Router(), obj));
/* 
app.get("/user", function(req, res){
    res.send("asd");
});

app.post("/user", function(req, res){
    res.send("asd");
});

app.put("/user", function(req, res){
    res.send("asd");
}); */