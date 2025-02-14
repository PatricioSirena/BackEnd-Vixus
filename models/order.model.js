const {model, Schema} = require('mongoose')

const OrderSchema = new Schema({
    userId: {
        type: String,
        required: true,
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

OrderSchema.methods.toJSON = function(){
    const {__v, userId, ...order} = this.toObject()
    return order
}

const OrderModel = model('order', OrderSchema)

module.exports = OrderModel

