const mongoose = require('mongoose')

const productInFavSchema = new mongoose.Schema({
    idProduct: {
        type: String,
        required: true,
        trim: true
    },
    variantId: {
        type: String,
        trim: true
    }
})

const FavoriteSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    products: {
        type: [productInFavSchema],
        default: []
    }
})

const FavModel = mongoose.model('favorite', FavoriteSchema)

module.exports = FavModel

