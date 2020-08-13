require('dotenv').config()
const express = require('express')
require('./db/mongoose')
const ejs = require("ejs");
const bcrypt = require('bcrypt')
const User = require('./models/user')
const bodyParser = require("body-parser");

const app = express()

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
  }));
const content = "Mo Gruhasti is a startup growing under the umbrella of its customers who love us and our services";

//Sign Up Page
app.get("/register",function(req,res) {
    res.render("register")
})

//Account creation
app.post('/register', function(req,res) {
    bcrypt.hash(req.body.password, 8, function(err, hash) {
        const newUser = new User({
            name: req.body.name,
            email: req.body.username,
            password: hash
        })
        newUser.save(function(err){
            if(err) {
                console.log(err)
            } else {
                res.render("home")
            }
        })
    })
})

app.get("/", function(req, res){

      res.render("home", {
        startingContent: content
        });
  });


const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
