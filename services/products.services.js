const ProductModel = require('../models/product.model')
const CartModel = require('../models/cart.model')
const FavModel = require('../models/favorite.model')
const StockModel = require('../models/stock.model.js')
const logger = require('../helpers/logger')

const newProduct = async (body) => {
    try {
        const productExist = await ProductModel.findOne({ name: body.name })
        if (productExist === null) {
            const product = new ProductModel(body)
            const productStock = new StockModel({productId: product._id})
            await product.save()
            await productStock.save()
            return 201
        } else {
            return 400
        }
    } catch (error) {
        logger.error(error)
    }
}

const changeState = async (productId) => {
    try {
        const product = await ProductModel.findById({ _id: productId })
        if (product === null) {
            return { msg: 'No encontramos el producto en la base de datos' }
        } else {
            product.active = !product.active
            await product.save()
            if (product.active) {
                return { msg: 'Producto activado con exito' }
            } else {
                return { msg: 'Producto desactivado con exito' }
            }
        }
    } catch (error) {
        logger.error(error)
    }
}

const addProductToCart = async (userId, productId) => {
    try {
        const product = await ProductModel.findById(productId)
        const cart = await CartModel.findOne({ userId })
        if (cart === null) {
            return { statusCode: 400, msg: 'Por favor comunicate con un administrador' }
        } else if (product === null) {
            return { statusCode: 400, msg: 'No encontramos el producto en la base de datos' }
        } else {
            const productInCart = cart.products.find((obj) => obj.idProduct.toString() === productId)
            if (productInCart === undefined) {
                cart.products.push({ quantity: 1, idProduct: product._id })
                await cart.save()
                return { statusCode: 200, msg: 'Producto agregado al carrito' }
            } else {
                productInCart.quantity++
                await CartModel.findByIdAndUpdate({ _id: cart._id }, cart)
                return { statusCode: 200, msg: `La cantidad de ${product.name} en el carrito es ${productInCart.quantity}` }
            }
        }
    } catch (error) {
        logger.error(error)
    }
}

const deleteProductFromCart = async (userId, productId) => {
    try {
        const product = await ProductModel.findById(productId)
        const cart = await CartModel.findOne({ userId })
        if (cart === null) {
            return { statusCode: 400, msg: 'Por favor comunicate con un administrador' }
        } else if (product === null) {
            return { statusCode: 400, msg: 'No encontramos el producto en la base de datos' }
        }
        const productInCart = cart.products.find((obj) => obj.idProduct.toString() === productId)
        if (productInCart === undefined) {
            return { statusCode: 404, msg: 'No encontramos el producto en el carrito' }
        } else {
            if (productInCart.quantity > 1) {
                productInCart.quantity--
                await CartModel.findByIdAndUpdate({ _id: cart._id }, cart)
                return { statusCode: 200, msg: `La cantidad de ${product.name} en el carrito es ${productInCart.quantity}` }
            } else {
                const productPosition = cart.products.findIndex((obj) => obj.idProduct.toString() === productId)
                cart.products.splice(productPosition, 1)
                await cart.save()
                return { statusCode: 200, msg: 'Producto eliminado del carrito' }
            }
        }
    } catch (error) {
        logger.error(error)
    }
}

const addProductToFavorite = async (userId, productId) => {
    try {
        const product = await ProductModel.findById(productId)
        const favorite = await FavModel.findOne({ userId })
        if (favorite === null) {
            return { statusCode: 400, msg: 'Por favor comunicate con un administrador' }
        } else if (product === null) {
            return { statusCode: 400, msg: 'No encontramos el producto en la base de datos' }
        } else {
            if (favorite.products.includes(productId)) {
                return { statusCode: 401, msg: 'El producto ya se encuentra en favoritos' }
            } else {
                favorite.products.push(productId)
                await favorite.save()
                return { statusCode: 200, msg: 'Producto agregado a favoritos' }
            }
        }
    } catch (error) {
        logger.error(error)
    }
}

const deleteProductFromFavorite = async (userId, productId) => {
    try {
        const product = await ProductModel.findById(productId)
        const favorite = await FavModel.findOne({ userId })
        if (favorite === null) {
            return { statusCode: 400, msg: 'Por favor comunicate con un administrador' }
        } else if (product === null) {
            return { statusCode: 400, msg: 'No encontramos el producto en la base de datos' }
        }
        if (favorite.products.includes(productId)) {
            const newFavorite = favorite.products.filter(item => item !== productId)
            favorite.products = newFavorite
            await favorite.save()
            return { statusCode: 200, msg: 'Producto eliminado de favoritos' }
        } else {
            return { statusCode: 404, msg: 'No encontramos el producto en favoritos' }
            }
    } catch (error) {
        logger.error(error)
    }
}

const getUserCart = async (userId) =>{
    try {
        const cart = await CartModel.findOne({userId})
        if(cart === null){
            return 404
        } else{
            return {products: cart.products}
        }
    } catch (error) {
        logger.error(error)
    }
}

const getUserFavorites = async (userId) =>{
    try {
        const favorites = await FavModel.findOne({userId})
        if(favorites === null){
            return 404
        } else{
            return {products: favorites.products}
        }
    } catch (error) {
        logger.error(error)
    }
}

const getAllProducts = async () =>{
    try {
        const products = await ProductModel.find()
        return products
    } catch (error) {
        logger.error(error)
    }
}

const getOneProduct = async (productId) =>{
    try {
        const product = await ProductModel.findById({_id: productId})
        if(product === null){
            return 404
        } else{
            return product
        }
    } catch (error) {
        logger.error(error)
    }
}


const productUpdate = async (productId, body) =>{
    try {
        const productToUpdate = await ProductModel.findByIdAndUpdate({_id: productId}, body)
        if(productToUpdate === null){
            return 404
        } else{
            return 200
        }
    } catch (error) {
        logger.error(error)
    }
}

const delProduct = async (productId) =>{
    try {
        const product = await ProductModel.findById(productId)
        if(product === null){
            return 404
        } else{
            const productStock = await StockModel.findOne({productId})
            await ProductModel.findByIdAndDelete(productId)
            await StockModel.findByIdAndDelete(productStock._id)
            return 200
        }
    } catch (error) {
        logger.error(error)
    }
}

module.exports = {
    newProduct,
    changeState,
    addProductToCart,
    deleteProductFromCart,
    addProductToFavorite,
    deleteProductFromFavorite,
    getUserCart,
    getUserFavorites,
    getAllProducts,
    getOneProduct,
    productUpdate,
    delProduct
}