const {model, Schema} = require('mongoose')

const ProductSchema = new Schema({
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
    categories:{
        type: Array,
        required: true
    },
    color: {
        type: String,
        default: ''
    },
    size: {
        type: String,
        default: '',
        enum: ['','S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL', '10', '12', '14', '16',
            '38', '40', '42', '44', '46', '48', '50', '52', '54', '56', '58', '60',
            '85', '90', '95', '100', '105', '110', '115', '120'
        ]
    },
    active: {
        type: Boolean,
        default: true
    },
    mainPicture:{
        type: String,
        default: null
    },
    galery: {
        type: Array
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const ProductModel = model('product', ProductSchema)

module.exports = ProductModel
