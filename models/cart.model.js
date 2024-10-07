const {model, Schema} = require('mongoose')

const CartSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    products: []
})

const CartModel = model('cart', CartSchema)

module.exports = CartModel

