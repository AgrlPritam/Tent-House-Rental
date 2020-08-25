require('dotenv').config()
const mongoose = require('mongoose')
const validator = require('validator')
const Customer = require('./customer')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {       //valid email check
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true,
        validate(value) {       //avoiding weak password
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    tokens: [{              //creating jaw tokens for each login. Can be used for multiple sessions by one user
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.virtual('customers',{        //For linking customer name with the user name. As to be a customer one needs to register. This feature is not complete till this release to keep it open
    ref:'Customer',
    localField:'name',
    foreignField:'customer_name'
})

//Generating Authentication tokens using jwt
userSchema.methods.generateAuthToken = async function () {      
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_TOKEN, { expiresIn:60*60 })    //One session expires in 1 hr. Curently disabled as no auth checks are done for each endpoint

    user.tokens = user.tokens.concat({ token })     //Storing all login session
    await user.save()

    return token
}

//User Login Authentication
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('No User Found')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Password Mismatch')
    }
    return user
}

//Future reference to any password change and linking to current password hashing algorithm
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = {
    User
}