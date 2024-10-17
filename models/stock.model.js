const {model, Schema} = require('mongoose')

const StockSchema = new Schema({
    productId: {
        type: string,
        required: true,
        uniquie: true
    },
    quantity: {
        type: Number,
        default: 0
    }
})

const StockModel = model('stock', StockSchema)
module.exports = StockModel