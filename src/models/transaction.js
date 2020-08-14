const mongoose = require('mongoose')
const shortid = require('shortid')
const { Timestamp } = require('mongodb')
const validator = require('validator')

const transactionSchema = new mongoose.Schema({
    transaction_id: {
        type: String,
        required: true,
        default: shortid.generate,
        unique: true
    },
    transaction_date_time: {
        type: Date,
        default: Date.now        
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Customer'
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
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