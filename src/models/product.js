const mongoose = require('mongoose')
const Transaction = require('./transaction')

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
        trim: true
    },
    quantity_booked: {
        type: Number,
        required: false,
        trim: true 
    },
    price: {
        type: String,
        required: true,
        trim: true 
    }
})

productSchema.virtual('transactions',{
    ref:'Transaction',
    localField:'product_id',
    foreignField:'product_id'
})


const Product = mongoose.model('Product', productSchema)

module.exports = Product