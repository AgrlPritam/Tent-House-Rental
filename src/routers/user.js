const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const bodyParser = require("body-parser")

const app = express()

const content = "Mo Gruhasti is a startup growing under the umbrella of its customers who love us and our services";

app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/register', (req,res) => {
    res.render("register")
})

app.get('/', (req,res) => {
    res.render('home',{
        startingContent: content
    })
})
app.post('/register', async (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.username,
        password: req.body.password
    })

    try {
        await newUser.save()
        const token = await newUser.generateAuthToken()
        res.status(201).redirect("/")
    } catch (e) {
        console.log(e)
        res.status(404).render("404",{
            error: "Ensure first time registration and password doesn't contain 'password'"
        })
    }
})

app.get('/login', (req,res) => {
    res.status(200).render("login")
})

app.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).redirect("/")
    } catch (e) {
        console.log(e)
        res.status(404).render("404",{
            error:"Login Issue"
        })
    }
})

app.post('/logout',auth, async(req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token            //if false it will filter out and keep it safe in tokens, if true it will not filter it and hence remove that token (comaparable to logout from specific devices)
        })
        await req.user.save()
        res.redirect("/")
    }catch(e) {
        res.redirect("404",{
            error:"Error logging out"
        })
    }
})

app.get("/register",function(req,res) {
    res.render("register")
})


module.exports = app