const mongoose = require('mongoose')
const Transaction = require('./transaction')

const customerSchema = new mongoose.Schema({
    customer_id: {
        type: Number,
        default: Math.floor((Math.random()*1000000)+1),
        trim: true,
        unique: true
    },
    customer_name: {
        type: String || mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    }
},{toJSON:{virtuals:true}})

customerSchema.virtual('transactions',{
    ref:'Transaction',
    localField:'customer_id',
    foreignField:'customer_id'
})

const Customer = mongoose.model('Customer', customerSchema)

module.exports = Customer