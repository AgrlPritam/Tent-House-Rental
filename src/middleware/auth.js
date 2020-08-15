require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/user')

//Middleware system to authorise user to access various endpoints. This feature is cuurently disabled
const auth = async (req, res, next) => {
    try {
        //some minor changes required here to verify current token(from user model) with stored tokens
        const Token = User.tokens.filter(() =>{
            return tokens[tokens.length-1]
        })
        const decoded = jwt.verify(Token.token , process.env.JWT_TOKEN)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }
        req.token = token 
        req.user = user
        next()
    } catch (e) {
        console.log(e)
        res.status(401).render("404",{
            error: "Please Authenticate Again"
        })
    }
}

module.exports = auth