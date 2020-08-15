require('dotenv').config()
const express = require('express')
require('./db/mongoose')
const ejs = require("ejs")
const userApp = require('./routers/user')

const app = express()
app.use(express.static("public"))
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(userApp)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})