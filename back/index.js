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
    // logging
    publics.l = {
        clog : function(...args){
            console.log("I: ",args)
        },
        cerr : function(...args){
            console.log("E: ", args);
        },
        cwar : function(...args){
            console.log("W: ", args);
        }
    
    };

    publics.hasOwnProperties = function(obj, arr){
        for (let i = 0; i < arr.length; i++) {
            const el = arr[i];
            if(!obj.hasOwnProperty(el)){
                return false;
            }
            
        }
        return true;
    }
    return publics;
}();




app.use("/user", user(express.Router(), {mysql: conn, mailer: mail, f: functionBundle, md5: md5}));
app.use("/users", users(express.Router(), {mysql: conn, mailer: mail, f: functionBundle, md5: md5}));
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