const express = require('express')
const User = require('../models/user')
const Product = require('../models/product')
const Customer = require('../models/customer')
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
            error: "Ensure new registration and password doesn't contain 'password'"
        })
    }
})

app.get('/product', async (req,res) => {
    await Product.find({},'product_id product_title quantity_total', function(err, products) {
        res.render("product", {
            products:products
        })
    }).sort({product_title:1})
})

app.get('/customer', async (req,res) => {
    await Customer.find({},'customer_id customer_name', function(err, customers) {
        res.render("customer", {
            customers:customers
        })
    }).sort({customer_name:1})
})

app.get('/login', (req,res) => {
    res.status(200).render("login")
})

app.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).redirect("product")
    } catch (e) {
        console.log(e)
        res.status(404).render("404",{
            error:"Login Issue"
        })
    }
})

app.get('/logout', (req,res) => {
    res.status(200).render("logout")
})

app.post('/logoutOne',auth, async(req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token            
        })
        await req.user.save()
        res.redirect("/login")
    }catch(e) {
        res.redirect("404",{
            error:"Error logging out"
        })
    }
})

app.post('/logoutAll',auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e) {
        res.send(500).send()
    }
})

app.get("/register",function(req,res) {
    res.render("register")
})


module.exports = app