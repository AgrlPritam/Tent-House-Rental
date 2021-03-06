const mongoose = require('mongoose')
const shortid = require('shortid')
const { Timestamp } = require('mongodb')
const validator = require('validator')

const transactionSchema = new mongoose.Schema({
    transaction_id: {
        type: String,
        default: shortid.generate,      //For generating short transaction IDs
        unique: true
    },
    transaction_date_time: {
        type: Date,
        default: Date.now    
    },
    customer_id: {
        type: Number || mongoose.Schema.Types.ObjectId,     //Link to customer ID. Feature not complete yet so accepting inputs from API
        default: Math.floor((Math.random()*1000000)+1),
        unique: true,
        ref:'Customer'
    },
    product_id: {
        type: Number || mongoose.Schema.Types.ObjectId,     //Same functionality as customer_id
        default: Math.floor((Math.random()*1000000)+1),
        unique: true,
        ref: 'Product'
    },
    transaction_type:{
        type:String,
        required:true,
        trim:true
    },
    quantity: {
        type:Number,
        required:true,
        default:0,
        validate(value) {
            if (value < 0) {
                throw new Error('Quantity must be a postive number')
            }
        }

    }
},{toJSON:{virtuals:true}})     //To populate virtuals when using JSON.stringify or res.json functions


const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction