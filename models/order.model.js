const {model, Schema} = require('mongoose')

const OrderSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    date:{
        type: String,
        required: true,
        trim: true
    },
    paymentLink: {
        type: String,
        required: true,
        trim: true
    },
    paymentStatus:{
        type: String,
        default: 'pending',
        enum: ['pending', 'approver', 'canceled']
    },
    products: []
})

const OrderModel = model('cart', OrderSchema)

module.exports = OrderModel

