require('dotenv').config()
const express = require('express')
require('./db/mongoose')
const mongoose = require('mongoose')
const ejs = require("ejs")
const bcrypt = require('bcrypt')
const userApp = require('./routers/user')
const bodyParser = require("body-parser")


const app = express()

app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(express.json())
app.use(userApp)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})