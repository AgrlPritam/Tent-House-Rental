const express = require('express')
const {User} = require('../models/user')
const Product = require('../models/product')
const Customer = require('../models/customer')
const Transaction = require('../models/transaction')
const auth = require('../middleware/auth')

const app = express()

//Random starting content
const content = "Mo Gruhasti is a startup growing under the umbrella of its customers who love us and our services. We serve all across the state of Odisha as of now and soon coming to your city. Stay connected for more updates.";

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.get('/', (req,res) => {
    res.render('home',{
        startingContent: content
    })
})

app.get('/register', (req,res) => {
    res.render("register")
})

app.post('/register', async (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.username,
        password: req.body.password
    })

    try {
        await newUser.save()
        const token = await newUser.generateAuthToken()     //Awaiting token generation
        res.cookie('auth_token',token)
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

//Products
app.get('/product', async (req,res) => {
    await Product.find({},'product_id product_title quantity_total', function(err, products) {
        res.render("product", {
            products:products
        })
    }).sort({product_title:1})      //Sorting in ascending order based on title
})

//API Only Product addition using Postman
app.post('/product',async (req,res)=> {
    const addProduct = new Product(req.body)
    try {
        await addProduct.save()
        res.status(201).send({addProduct})
    }catch(e) {
        res.status(400).send(e)
    }
})

//Rental or Return Page for transaction to be done
app.get('/transact', async (req,res) => {           //auth route can be added for indivdual user access
    await Product.find({},'product_title', function(err, products) {
        res.render("transact", {
            products:products
        })
    })
})

//Landing page post transaction is done
app.get('/transaction',async (req,res) => {         //auth route can be added for user specific data viewing
    await Transaction.find({},'transaction_id transaction_date_time transaction_type quantity', function(err, transactions){
        res.render("transaction", {
            transactions:transactions
        })
    }).sort({transaction_date_time:-1})     //Descending order based on timestamp
})

//Making a transaction. Updates transactions table. Extra functionality for updating product table can be added by parsing the JSON response and updating each row in table
//Check transact.ejs
app.post('/transact',async (req,res) => {           //auth route can be added for user specific data viewing
    const jsonString = JSON.stringify(req.body,null)
    const parsedJSON = JSON.parse(jsonString)
    value = 0
    for(i=0;i<parsedJSON.product.length;i++){
        value += +parsedJSON.product[i]       //Converting String type JSON values to integer for storing total transaction quantity
    }
    typeTransaction = (parsedJSON.state == 'rent') ? "OUT" : "IN";  
        const newTransaction = new Transaction({
            transaction_type:typeTransaction,
            quantity: value
        })
        try {
            await newTransaction.save()
            res.status(201).redirect("/transaction")
        } catch (e) {
            console.log(e)
            res.status(404).render("404",{
                error: "Error while transacting"
            })
        }
})

//API Only (use Postman). Additional feature alongwith above to add data in transaction table
app.post('/transaction', async (req,res) => {       //auth route can be added for user specific data viewing
    const addTransaction = new Transaction(req.body)
    try {
        await addTransaction.save()
        res.status(201).send({addTransaction})
    } catch(e) {
        res.status(400).send(e)
    }
})

//check customer.ejs
app.get('/customer',auth, async (req,res) => {
    await Customer.find({},'customer_id customer_name', function(err, customers) {
        res.render("customer", {
            customers:customers
        })
    }).sort({customer_name:1})
})

//API only adding Customer using Postman
app.post('/customer',async (req,res) => {
    const addCustomer = new Customer(req.body)
    try {
        await addCustomer.save()
        res.status(201).send({addCustomer})
    }catch(e) {
        res.status(400).send(e)
    }
})

//Check login.ejs
app.get('/login', (req,res) => {
    res.status(200).render("login")
})

//login post method. Accepts email and password. Verifies token and password for login.
app.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        res.cookie('auth_token', token)
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

//Logout route handler
app.get('/logout',auth, (req,res) => {
    res.status(200).render("logout")
})

//Currently both logoutOne and logoutAll complete handler is non-functional as auth route needs to be handled
app.post('/logoutOne',auth, async(req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token            
        })
        await req.user.save()
        res.redirect("/login")
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