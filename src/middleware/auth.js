require('dotenv').config()
const jwt = require('jsonwebtoken')
const {User, token} = require('../models/user')

//Middleware system to authorise user to access various endpoints. This feature is cuurently disabled
const auth = async (req, res, next) => {
    try {
        const token = req.cookies['auth_token']
        const decoded = jwt.verify(token , process.env.JWT_TOKEN)
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