const ProductModel = require('../models/product.model')
const UserModel = require('../models/user.model.js')
const CartModel = require('../models/cart.model')
const FavModel = require('../models/favorite.model')
const OrderModel = require('../models/order.model.js')
const CategoryModel = require('../models/category.model.js')
const cloudinary = require('../helpers/cloudinary.js')
const logger = require('../helpers/logger')
const sharp = require('sharp');
const { envioDeOrdenDeCompra } = require('../helpers/nodemailer.messages')
const { MercadoPagoConfig, Preference } = require('mercadopago')


const newProduct = async (body) => {
    try {
        const productExist = await ProductModel.findOne({ name: body.name })
        if (productExist === null) {
            const product = new ProductModel(body)
            await product.save()
            return { statusCode: 201, productId: product._id }
        } else {
            return 400
        }
    } catch (error) {
        logger.error(error)
    }
}

const newVariant = async (productId, body) => {
    try {
        const product = await ProductModel.findById(productId)
        if (product === null) return 404
        body.color = body.color.toLowerCase().trim()
        const variantExist = product.variants.find((obj) => obj.color === body.color)
        if (variantExist !== undefined) return 400
        product.variants.push(body)
        await product.save()
        return 201
    } catch (error) {
        logger.error(error)
    }
}

const newStockPerSize = async (body) => {
    try {
        body.size = body.size.toLowerCase().trim()
        const product = await ProductModel.findOne({ _id: body.productId })
        if (product === null) return 404
        const variantPosition = product.variants.findIndex((obj) => obj._id.toString() === body.variantId)
        if (variantPosition < 0) return 404
        const sizePosition = product.variants[variantPosition].sizes.findIndex((obj) => obj.size === body.size)
        if (sizePosition < 0) {
            product.variants[variantPosition].sizes.push({ size: body.size, stock: body.stock })
            await product.save()
            return 201
        }
        product.variants[variantPosition].sizes[sizePosition].stock = body.stock
        await product.save()
        return 200
    }
    catch (error) {
        logger.error(error)
    }
}

const newCategory = async (body) => {
    try {
        const nameToLowerCase = body.name.toLowerCase()
        const categoryExist = await CategoryModel.findOne({ name: nameToLowerCase })
        if (categoryExist === null) {
            const category = new CategoryModel({ name: nameToLowerCase })
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
            const buffer = image.buffer;
            const processedBuffer = await sharp(buffer)
                .resize(1000, 1000, {
                    fit: 'cover',
                })
                .jpeg({ quality: 90 })
                .toBuffer();
            const upload = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    });
                stream.end(processedBuffer);  // Envía el buffer procesado
            }); return (upload.secure_url)
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

const newProductImage = async (body) => {
    try {
        const product = await ProductModel.findById({ _id: body.productId })
        if (product === null) return 404
        const variantPosition = product.variants.findIndex((obj) => obj._id.toString() === body.variantId)
        if (variantPosition < 0) return 404
        product.variants[variantPosition].galery.push({ imageUrl: body.imageUrl })
        await product.save()
        return 200
    } catch (error) {
        logger.error(error)
    }
}

const setMainImage = async (productId, imageUrl) => {
    try {
        const product = await ProductModel.findById({ _id: productId })
        if (product === null) return 404
        product.mainPicture = imageUrl
        await product.save()
        return 200
    } catch (error) {
        logger.error(error)
    }
}

const changeState = async (productId) => {
    try {
        const product = await ProductModel.findById({ _id: productId })
        if (product === null) return { msg: 'No encontramos el producto en la base de datos' }
        product.active = !product.active
        await product.save()
        if (product.active) {
            return { msg: 'Producto activado con exito' }
        } else {
            return { msg: 'Producto desactivado con exito' }
        }
    } catch (error) {
        logger.error(error)
    }
}

const addProductToCart = async (userId, body) => {
    try {
        const product = await ProductModel.findOne({ _id: body.productId })
        if (!product) return 404
        const variantExist = product.variants.find((obj) => obj._id.toString() === body.variantId)
        if (variantExist === undefined) return 404
        const sizeExist = variantExist.sizes.find((obj) => obj._id.toString() === body.sizeId)
        if (sizeExist === undefined) return 404
        if (sizeExist.stock === 0) return 400
        const cart = await CartModel.findOne({ userId })
        if (!cart) return 406
        const productInCartPosition = cart.products.findIndex((obj) => obj.idProduct === body.productId && obj.variantId === body.variantId && obj.sizeId === body.sizeId)
        if (productInCartPosition < 0) {
            cart.products.push({ idProduct: body.productId, variantId: body.variantId, sizeId: body.sizeId, quantity: 1 })
            await cart.save()
            return 201
        } else {
            cart.products[productInCartPosition].quantity++
            await cart.save()
            return 200
        }
    } catch (error) {
        logger.error(error)
    }
}

const deleteProductFromCart = async (userId, productInCartId) => {
    try {
        const cart = await CartModel.findOne({ userId })
        if (!cart) return 400
        const productInCartPosition = cart.products.findIndex((obj) => obj._id.toString() === productInCartId)
        if (productInCartPosition < 0) return 404
        cart.products.splice(productInCartPosition, 1)
        await cart.save()
        return 200
    } catch (error) {
        logger.error(error)
    }
}

const addProductToFavorite = async (userId, body) => {
    try {
        const product = await ProductModel.findOne({ _id: body.productId })
        if (!product) return 404
        const variantExist = product.variants.find((obj) => obj._id.toString() === body.variantId)
        if (variantExist === undefined) return 404
        const favorite = await FavModel.findOne({ userId })
        if (!favorite) return 406
        const productInFavPosition = favorite.products.findIndex((obj) => obj.idProduct === body.productId && obj.variantId === body.variantId)
        if (productInFavPosition < 0) {
            favorite.products.push({ idProduct: body.productId, variantId: body.variantId })
            await favorite.save()
            return 201
        } else {
            return 400
        }
    } catch (error) {
        logger.error(error)
    }
}

const deleteProductFromFavorite = async (userId, productInFavId) => {
    try {
        const favorite = await FavModel.findOne({ userId })
        if (!favorite) return 400
        const productInFavPosition = favorite.products.findIndex((obj) => obj._id.toString() === productInFavId)
        if (productInFavPosition < 0) return 404
        favorite.products.splice(productInFavPosition, 1)
        await favorite.save()
        return 200
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
            const variant = product.variants.find((objeto) => objeto._id.toString() === obj.variantId)
            const size = variant.sizes.find((objeto) => objeto._id.toString() === obj.sizeId)
            return {
                title: `${product.name} - ${variant.color} - ${size.size}`,
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
        if (product === null) {
            return 404
        } else if (!product.categories.includes(categoryName)) {
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
        return products
    } catch (error) {
        logger.error(error)
    }
}

const getOneProduct = async (productId) => {
    try {
        const product = await ProductModel.findById({ _id: productId })
        if (product === null) return 404
        return product
    } catch (error) {
        logger.error(error)
    }
}

const getUserOrders = async (userId) => {
    try {
        const orders = await OrderModel.find({ userId })
        if (orders.length === 0) return { statusCode: 404, msg: 'No encontramos ordenes de compra' }
        return { statusCode: 200, orders }
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
        return products
    } catch (error) {
        logger.error(error)
    }
}

const productUpdate = async (productId, body) => {
    try {
        if (body.active !== undefined || body.categories !== undefined || body.createdAt !== undefined || body.variants !== undefined) return 400
        const product = await ProductModel.findOne({ _id: productId })
        if (product === null) return 404
        await ProductModel.findByIdAndUpdate({ _id: productId }, body)
        return 200
    } catch (error) {
        logger.error(error)
    }
}

const deleteProductVariant = async (productId, variantId) => {
    try {
        const product = await ProductModel.findById({ _id: productId })
        if (product === null) return 404
        const variantPosition = product.variants.findIndex(obj => obj._id.toString() === variantId)
        if (variantPosition < 0) return 404
        product.variants.splice(variantPosition, 1)
        await product.save()
        return 200
    } catch (error) {
        logger.error(error)
    }
}

const deleteImageFromProduct = async (productId, variantId, imageId) => {
    try {
        const product = await ProductModel.findById({ _id: productId })
        if (product === null) return 404
        const variantPosition = product.variants.findIndex(obj => obj._id.toString() === variantId)
        if (variantPosition < 0) return 404
        const imgPosition = product.variants[variantPosition].galery.findIndex(obj => obj._id.toString() === imageId)
        if (imgPosition < 0) return 400
        const imgIdToDelete = product.variants[variantPosition].galery[imgPosition].imageUrl.split('/').pop().split('.')[0];
        product.variants[variantPosition].galery.splice(imgPosition, 1)
        await cloudinary.uploader.destroy(imgIdToDelete)
        await product.save()
        return 200
    } catch (error) {
        logger.error(error)
    }
}

const deleteSizeFromVariant = async (productId, variantId, sizeId) => {
    try {
        const product = await ProductModel.findById({ _id: productId })
        if (product === null) return 404
        const variantPosition = product.variants.findIndex(obj => obj._id.toString() === variantId)
        if (variantPosition < 0) return 404
        const sizePosition = product.variants[variantPosition].sizes.findIndex(obj => obj._id.toString() === sizeId)
        if (sizePosition < 0) return 400
        product.variants[variantPosition].sizes.splice(sizePosition, 1)
        await product.save()
        return 200
    } catch (error) {
        logger.error(error)
    }
}

const delProduct = async (productId) => {
    try {
        const product = await ProductModel.findById(productId)
        if (product === null) return 404
        product.variants.forEach(async (obj) => {
            obj.galery.forEach(async (img) => {
                const imgIdToDelete = img.imageUrl.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(imgIdToDelete)
            })
        })
        await ProductModel.findByIdAndDelete({ _id: productId })
        return 200
    } catch (error) {
        logger.error(error)
    }
}

const delCategory = async (categoryId) => {
    try {
        const category = await CategoryModel.findByIdAndDelete({ _id: categoryId })
        if (category === null) return 404
        return 200
    } catch (error) {
        logger.error(error)
    }
}

module.exports = {
    newProduct,
    newVariant,
    newStockPerSize,
    newCategory,
    cloudUpload,
    cloudDelete,
    newProductImage,
    setMainImage,
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
    deleteProductVariant,
    deleteImageFromProduct,
    deleteSizeFromVariant,
    delProduct,
    delCategory
}