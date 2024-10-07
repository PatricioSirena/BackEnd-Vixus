const {model, Schema} = require('mongoose')

const FavoriteSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    products: []
})

const FavModel = model('favorite', FavoriteSchema)

module.exports = FavModel

