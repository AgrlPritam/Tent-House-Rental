const mongoose = require('mongoose')
const Transaction = require('./transaction')
const validator = require('validator')

const productSchema = new mongoose.Schema({
    product_id: {
        type: Number,
        default: Math.floor((Math.random()*1000000)+1), //Random 5 digit product id
        unique:true,
        trim: true
    },
    product_title: {
        type: String,
        required: true,
        trim: true
    },
    quantity_total: {
        type: Number,
        required: true,
        trim: true,
        validate(value) {
            if (value < 0) {
                throw new Error('Quantity must be a postive number')
            }
        }
    },
    quantity_booked: {
        type: Number,
        required: false,
        default: 0,
        trim: true,
        validate(value) {
            if (value < 0) {
                throw new Error('Quantity must be a postive number')
            }
        } 
    },
    price: {
        type: String,
        required: true,
        trim: true 
    }
},{toJSON:{virtuals:true}})

//For linking product_id for virtual connection to transaction table. Currently feature disabled
productSchema.virtual('transactions',{
    ref:'Transaction',
    localField:'product_id',
    foreignField:'product_id'
})


const Product = mongoose.model('Product', productSchema)

module.exports = Product