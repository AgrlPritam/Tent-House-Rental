require('dotenv').config()
const express = require('express')
require('./db/mongoose')
const ejs = require("ejs")
const userApp = require('./routers/user')
const cookieParser = require('cookie-parser')


const app = express()
app.use(express.static("public"))       //Adding css style
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cookieParser())
app.use(userApp)            //from user route handler

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})