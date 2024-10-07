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
        required: true
    },
    description: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: ''
    },
    size: {
        type: String,
        default: '',
        enum: ['s', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl', '12', '14', '16',
            '38', '40', '42', '44', '46', '48', '50', '52', '54', '56', '58', '60',
            '85', '90', '95', '100', '105', '110', '115', '120'
        ]
    },
    active: {
        type: Boolean,
        default: false
    },
    inStock: {
        type: Number,
        default: 0
    },
    mainPicture:{
        type: String,
        default: ''
    },
    galery: {
        type: Array
    }
})

const ProductModel = model('product', ProductSchema)

module.exports = ProductModel
