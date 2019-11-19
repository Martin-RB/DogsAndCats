let parser = require("body-parser");
let express = require("express");
let mysql = require("mysql");
let mail = require("nodemailer");

var app = express();


app.listen(6969, function(e){
    console.log(e);
    console.log("Server ON");
});

var router = express.Router();

app.get("/", function(req, res){
    res.send("asd");
})