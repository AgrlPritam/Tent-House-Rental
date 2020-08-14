require('dotenv').config()
const mongoose = require('mongoose')
const validator = require('validator')
const Customer = require('./customer')

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
        validate(value) {
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
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    }
})

userSchema.virtual('customers',{
    ref:'Customer',
    localField:'name',
    foreignField:'customer_name'
})


const User = mongoose.model('User', userSchema)

module.exports = User