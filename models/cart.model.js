const mongoose = require('mongoose')

const productInCartSchema = new mongoose.Schema({
    idProduct: {
        type: String,
        required: true,
        trim: true
    },
    variantId: {
        type: String,
        required: true,
        trim: true
    },
    sizeId: {
        type: String,
        required: true,
        trim: true
    }, 
    addedPrice:{
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        default: 0
    }
})

const CartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    products: {
        type: [productInCartSchema],
        default: []
    }
})

const CartModel = mongoose.model('cart', CartSchema)

module.exports = CartModel

