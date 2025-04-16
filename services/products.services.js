const ProductModel = require('../models/product.model')
const UserModel = require('../models/user.model.js')
const CartModel = require('../models/cart.model')
const FavModel = require('../models/favorite.model')
const StockModel = require('../models/stock.model.js')
const OrderModel = require('../models/order.model.js')
const CategoryModel = require('../models/category.model.js')
const cloudinary = require('../helpers/cloudinary.js')
const logger = require('../helpers/logger')
const { envioDeOrdenDeCompra } = require('../helpers/nodemailer.messages')
const { MercadoPagoConfig, Preference } = require('mercadopago')


const newProduct = async (body) => {
    try {
        const productExist = await ProductModel.findOne({ name: body.name })
        if (productExist === null) {
            const product = new ProductModel(body)
            const productStock = new StockModel({ productId: product._id })
            await product.save()
            await productStock.save()
            return { statusCode: 201, productId: product._id }
        } else {
            return 400
        }
    } catch (error) {
        logger.error(error)
    }
}

const newCategory = async (body) => {
    try {
        const nameToLowerCase = body.name.toLowerCase()
        const categoryExist = await CategoryModel.findOne({ name: nameToLowerCase })
        if (categoryExist === null) {
            const category = new CategoryModel({name: nameToLowerCase})
            await category.save()
            return 201
        } else {
            return 400
        }
    } catch (error) {
        logger.error(error)
    }
}

const cloudUpload = async (image) => {
    try {
        if (image === undefined) {
            return 400
        } else {
            const upload = await cloudinary.uploader.upload(image.path)
            return (upload.secure_url)
        }
    } catch (error) {
        logger.error(error)
    }
}

const cloudDelete = async (body) => {
    try {
        if (body.url === '') {
            return 400
        }
        const imgIdToDelete = body.url.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(imgIdToDelete)
        return 200
    } catch (error) {
        logger.error(error)
    }
}

const mainProductImage = async (productId, body) => {
    try {
        if (body.imageUrl === '') {
            return 400
        }
        const product = await ProductModel.findById(productId)
        if (product === null) {
            return 404
        } else {
            const urlToDelete = product.mainPicture
            if (urlToDelete === null) {
                product.mainPicture = body.imageUrl
                await product.save()
                return 200
            } else {
                const imgIdToDelete = urlToDelete.split('/').pop().split('.')[0];
                product.mainPicture = body.imageUrl
                await product.save()
                await cloudinary.uploader.destroy(imgIdToDelete)
                return 200
            }
        }
    } catch (error) {
        logger.error(error)
    }
}

const newProductImage = async (productId, body) => {
    try {
        const { imageUrl, imageId } = body
        if (imageUrl === '') {
            return 400
        }
        const product = await ProductModel.findById(productId)
        if (product === null) {
            return 404
        } else {
            const newImage = { imageId, url: imageUrl }
            product.galery.push(newImage)
            await product.save()
            return 200
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
        const productStock = await StockModel.findOne({ productId })
        if (cart === null) {
            return { statusCode: 400, msg: 'Por favor comunicate con un administrador' }
        } else if (product === null || productStock === null) {
            return { statusCode: 404, msg: 'No encontramos el producto en la base de datos' }
        } else if (productStock.quantity === 0) {
            return { statusCode: 400, msg: 'Producto sin stock' }
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
            return { statusCode: 404, msg: 'No encontramos el producto en la base de datos' }
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
            return { statusCode: 404, msg: 'No encontramos el producto en la base de datos' }
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
            return { statusCode: 404, msg: 'No encontramos el producto en la base de datos' }
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

const payWithMP = async (userId) => {
    try {
        const client = await UserModel.findOne({ _id: userId })
        const cart = await CartModel.findOne({ userId })
        if (cart === null) {
            return { statusCode: 404, msg: 'Por favor comunicate con un administrador' }
        }
        if (cart.products.length === 0) {
            return { statusCode: 404, msg: 'No hay productos en el carrito' }
        }
        const clientMP = new MercadoPagoConfig({ accessToken: process.env.MP_TOKEN })
        const preference = new Preference(clientMP)
        const buys = await Promise.all(cart.products.map(async (obj) => {
            const product = await ProductModel.findById({ _id: obj.idProduct })
            return {
                title: product.name,
                quantity: obj.quantity,
                unit_price: product.price,
                currency_id: 'ARS'
            }
        }))
        const result = await preference.create({
            body: {
                items: buys,
                back_urls: {
                    success: 'http://localhost:5173/userCart',
                    failure: 'http://localhost:5173/userCart',
                    pending: 'http://localhost:5173/userCart'
                },
                auto_return: 'approved'
            }
        })
        const orderDate = new Date().toString()
        const order = new OrderModel({ userId, products: cart.products, date: orderDate, paymentLink: result.init_point })
        cart.products = []
        envioDeOrdenDeCompra(client.email, result.init_point)
        await order.save()
        await cart.save()
        return { mpLink: result.init_point }
    } catch (error) {
        logger.error(error)
    }
}

const addCategoryToProduct = async (productId, categoryName) => {
    try {
        const product = await ProductModel.findOne({ _id: productId })
        const category = await CategoryModel.findOne({ name: categoryName })
        if (product === null || category === null) {
            return 404
        } else if (product.categories.includes(category.name)) {
            return 400
        } else {
            product.categories.push(category.name)
            await product.save()
            return 200
        }
    } catch (error) {
        logger.error(error)
    }
}

const delCategoryFromProduct = async (productId, categoryName) => {
    try {
        const product = await ProductModel.findOne({ _id: productId })
        const category = await CategoryModel.findOne({ name: categoryName })
        if (product === null || category === null) {
            return 404
        } else if (!product.categories.includes(category.name)) {
            return 400
        } else {
            product.categories = product.categories.filter(cat => cat !== category.name)
            await product.save()
            return 200
        }
    }
    catch (error) {
        logger.error(error)
    }
}

const getUserCart = async (userId) => {
    try {
        const cart = await CartModel.findOne({ userId })
        if (cart === null) {
            return 404
        } else {
            return { products: cart.products }
        }
    } catch (error) {
        logger.error(error)
    }
}

const getUserFavorites = async (userId) => {
    try {
        const favorites = await FavModel.findOne({ userId })
        if (favorites === null) {
            return 404
        } else {
            return { products: favorites.products }
        }
    } catch (error) {
        logger.error(error)
    }
}

const getLatestProducts = async () => {
    try {
        const products = await getAllProducts()
        const orderedProducts = products.sort((a, b) => a.createdAt - b.createdAt).reverse()
        const latestProducts = orderedProducts.slice(0, 10)
        return latestProducts
    } catch (error) {
        logger.error(error)
    }
}

const getAllProducts = async () => {
    try {
        const products = await ProductModel.find()
        const stock = await StockModel.find()
        const productsWithStock = products.map(product => {
            const productCopy = product.toObject();
            const stockOfProduct = stock.find(obj => obj.productId.toString() === productCopy._id.toString());
            productCopy.quantity = stockOfProduct ? stockOfProduct.quantity : 0;
            const { __v, ...productToReturn } = productCopy
            return productToReturn;
        });
        return productsWithStock
    } catch (error) {
        logger.error(error)
    }
}

const getOneProduct = async (productId) => {
    try {
        const product = await ProductModel.findById({ _id: productId })
        const stock = await StockModel.findOne({ productId })
        const productCopy = product.toObject();
        const { __v, ...productToReturn } = productCopy
        productToReturn.quantity = stock.quantity
        if (product === null || stock === null) {
            return 404
        } else {
            return productToReturn
        }
    } catch (error) {
        logger.error(error)
    }
}

const getUserOrders = async (userId) => {
    try {
        const orders = await OrderModel.find({ userId })
        if (orders.length === 0) {
            return { statusCode: 404, msg: 'No encontramos ordenes de compra' }
        } else {
            return { statusCode: 200, orders }
        }
    } catch (error) {
        logger.error(error)
    }
}

const getAllCategories = async () => {
    try {
        const categories = await CategoryModel.find()
        return categories
    } catch (error) {
        logger.error(error)
    }
}

const getProductsByCategory = async (categoryName) => {
    try {
        const allProducts = await getAllProducts()
        categoryName = categoryName.toLowerCase()
        const productsByCategory = allProducts.filter(product => product.categories.includes(categoryName))
        return productsByCategory
    } catch (error) {
        logger.error(error)
    }
}

const searchProducts = async (keyword) => {
    try {
        const searchRule = new RegExp(keyword, 'i')
        const products = await ProductModel.find({ name: searchRule, description: searchRule })
        const stock = await StockModel.find()
        const productsWithStock = products.map(product => {
            const productCopy = product.toObject();
            const stockOfProduct = stock.find(obj => obj.productId.toString() === productCopy._id.toString());
            productCopy.quantity = stockOfProduct ? stockOfProduct.quantity : 0;
            const { __v, ...productToReturn } = productCopy
            return productToReturn;
        });
        return productsWithStock
    } catch (error) {
        logger.error(error)
    }
}

const productUpdate = async (productId, body) => {
    try {
        const { quantity, ...newBody } = body
        const productStock = await StockModel.findOne({ productId })
        const productExist = await ProductModel.findOne({ _id: productId })
        if (productExist === null || productStock === null) {
            return 404
        } else {
            await ProductModel.findByIdAndUpdate({ _id: productId }, newBody)
            productStock.quantity = quantity
            await productStock.save()
            return 200
        }
    } catch (error) {
        logger.error(error)
    }
}

const deleteImageFromProduct = async (productId, imgId) => {
    try {
        const product = await ProductModel.findById(productId)
        if (product === null) {
            return 404
        }
        const imgPosition = product.galery.findIndex(obj => obj.imageId === imgId)
        if (imgPosition === -1) {
            return 400
        } else {
            const urlToDelete = product.galery.find(obj => obj.imageId === imgId).url
            const imgIdToDelete = urlToDelete.split('/').pop().split('.')[0];
            product.galery.splice(imgPosition, 1)
            await cloudinary.uploader.destroy(imgIdToDelete)
            await product.save()
            return 200
        }
    } catch (error) {
        logger.error(error)
    }
}

const delProduct = async (productId) => {
    try {
        const product = await ProductModel.findById(productId)
        if (product === null) {
            return 404
        } else {
            product.galery.forEach(async (obj) => {
                const urlToDelete = obj.imageUrl
                const imgIdToDelete = urlToDelete.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(imgIdToDelete)
            })
            const productStock = await StockModel.findOne({ productId })
            await ProductModel.findByIdAndDelete(productId)
            await StockModel.findByIdAndDelete(productStock._id)
            return 200
        }
    } catch (error) {
        logger.error(error)
    }
}

const delCategory = async (categoryId) => {
    try {
        const category = await CategoryModel.findByIdAndDelete({ _id: categoryId })
        if (category === null) {
            return 404
        } else {
            return 200
        }
    } catch (error) {
        logger.error(error)
    }
}

module.exports = {
    newProduct,
    newCategory,
    cloudUpload,
    cloudDelete,
    mainProductImage,
    newProductImage,
    changeState,
    addProductToCart,
    deleteProductFromCart,
    addProductToFavorite,
    deleteProductFromFavorite,
    payWithMP,
    addCategoryToProduct,
    delCategoryFromProduct,
    getUserCart,
    getUserFavorites,
    getLatestProducts,
    getAllProducts,
    getOneProduct,
    getUserOrders,
    getAllCategories,
    getProductsByCategory,
    searchProducts,
    productUpdate,
    deleteImageFromProduct,
    delProduct,
    delCategory
}