const express = require('express')
const User = require('../models/user')
const Product = require('../models/product')
const Customer = require('../models/customer')
const Transaction = require('../models/transaction')
const auth = require('../middleware/auth')

const app = express()

const content = "Mo Gruhasti is a startup growing under the umbrella of its customers who love us and our services";

app.use(express.urlencoded({extended:true}))
app.use(express.json())

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
        res.status(201).render("success",{
            eventDone: "Registered"
        })
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

app.get('/transact', async (req,res) => {
    await Product.find({},'product_title product_id', function(err, products) {
        res.render("transact", {
            products:products
        })
    })
})

app.get('/transaction',async (req,res) => {
    await Transaction.find({},'transaction_id transaction_date_time transaction_type quantity', function(err, transactions){
        res.render("transaction", {
            transactions:transactions
        })
    }).sort({transaction_date_time:-1})
})

app.post('/transact',async (req,res) => {
    const jsonString = JSON.stringify(req.body,null)
    const text = JSON.parse(jsonString)
    console.log(text)
    res.redirect('/transaction')
})

//API Only (use Postman)
app.post('/transaction',async (req,res) => {
    const addTransaction = new Transaction(req.body)
    try {
        await addTransaction.save()
        res.status(201).send({addTransaction})
    } catch(e) {
        res.status(400).send(e)
    }
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
        res.status(200).render("success",{
            eventDone:"Logged In"
        })
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
        res.render("/login")
    }catch(e) {
        res.render("404",{
            error:"Error logging out"
        })
    }
})

app.post('/logoutAll',auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).render("success",{
            eventDone:"Logged Out"
        })
    }catch(e) {
        res.status(500).render("404",{
            error:"Error logging out"
        })
    }
})

module.exports = app