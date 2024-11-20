const {model, Schema} = require('mongoose')

const StockSchema = new Schema({
    productId: {
        type: String,
        required: true,
        uniquie: true
    },
    quantity: {
        type: Number,
        default: 0
    }
})

StockSchema.methods.toJSON = function(){
    const { __v, ...stock} = this.toObject()
    return stock
}

const StockModel = model('stock', StockSchema)
module.exports = StockModel