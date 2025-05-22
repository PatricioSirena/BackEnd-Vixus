const mongoose = require('mongoose')

const sizeSchema = new mongoose.Schema({
    size: { type: String, required: true },
    stock: { type: Number, default: 0 }
});

const imageSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true }
});

const variantSchema = new mongoose.Schema({
    color: { type: String, required: true },
    sizes: { type: [sizeSchema], default: [] },
    galery: { type: [imageSchema], default: [] },
});

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    categories: {
        type: Array,
        default: []
    },
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    variants: {
        type: [variantSchema],
        default: []
    }
})

const ProductModel = mongoose.model('product', ProductSchema)

module.exports = ProductModel
