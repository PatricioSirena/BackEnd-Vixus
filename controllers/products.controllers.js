const productServices = require('../services/products.services')
const logger = require('../helpers/logger')


const createProduct = async (req, res) => {
    try {
        const result = await productServices.newProduct(req.body)
        if (result.statusCode === 201) {
            res.status(201).json({ msg: 'Producto creado con exito', productId: result.productId})
        } else {
            res.status(400).json({ msg: `El producto ${req.body.name} ya existe en la base de datos` })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const uploadToCloud = async (req, res) =>{
    try {
        const result = await productServices.cloudUpload(req.file)
        if(result === 400){
            res.status(400).json({msg: 'No recibimos la imagen'})
        } else{
            res.status(200).json(result)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteFromCloud = async (req, res) =>{
    try {
        const result = await productServices.cloudDelete(req.body)
        if(result === 400){
            res.status(400).json({msg: 'No recibimos la url de la imagen'})
        } else{
            res.status(200).json({msg: 'Imagen eliminada de la nube'})
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const setMainPicture = async (req, res) =>{
    try {
        const result = await productServices.mainProductImage(req.params.productId, req.body)
        if(result === 400){
            res.status(400).json({msg: 'No recibimos ninguna imagen'})
        } else if(result === 404){
            res.status(404).json({msg: 'No encontramos el producto en la base de datos'})
        } else{
            res.status(200).json({msg: 'Imagen de portada cargada correctamente'})
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const addProductImage = async (req, res) =>{
    try {
        const result = await productServices.newProductImage(req.params.productId, req.body)
        if(result === 400){
            res.status(400).json({msg: 'No recibimos ninguna imagen'})
        } else if(result === 404){
            res.status(404).json({msg: 'No encontramos el producto en la base de datos'})
        } else{
            res.status(200).json({msg: 'Imagen agregada correctamente'})
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const productState = async (req, res) => {
    try {
        const result = await productServices.changeState(req.params.productId)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

const addToCart = async (req, res) => {
    try {
        const result = await productServices.addProductToCart(req.userId, req.params.productId)
        if (result.statusCode === 400) {
            res.status(400).json({ msg: result.msg })
        } else if(result.statusCode === 404){
            res.status(404).json({msg: result.msg})
        }else {
            res.status(200).json({ msg: result.msg })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const delFromCart = async (req, res) => {
    try {
        const result = await productServices.deleteProductFromCart(req.userId, req.params.productId)
        if (result.statusCode === 400) {
            res.status(400).json({ msg: result.msg })
        } else if (result.statusCode === 404){
            res.status(404).json({msg: result.msg})
        }else {
            res.status(200).json({ msg: result.msg })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const addToFavorite = async (req, res) => {
    try {
        const result = await productServices.addProductToFavorite(req.userId, req.params.productId)
        if(result.statusCode === 400){
            res.status(400).json({msg: result.msg})
        } else if(result.statusCode === 401){
            res.status(401).json({msg: result.msg})
        } else if(result.statusCode === 404){
            res.status(404).json({msg: result.msg})
        } else {
            res.status(200).json({ msg: result.msg })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const delFromFavorite = async (req, res) => {
    try {
        const result = await productServices.deleteProductFromFavorite(req.userId, req.params.productId)
        if(result.statusCode === 400){
            res.status(400).json({msg: result.msg})
        } else if(result.statusCode === 404){
            res.status(404).json({msg: result.msg})
        } else{
            res.status(200).json({msg: result.msg})
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const mpPayment = async (req, res) =>{
    try {
        const result = await productServices.payWithMP(req.userId)
        if (result.statusCode === 404){
            res.status(404).json({msg: result.msg})
        } else{
            res.status(200).json(result)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const changeProductStock = async (req, res) =>{
    try {
        const result = await productServices.updateProductStock(req.params.productId, req.body)
        if(result === 404){
            res.status(404).json({msg: 'No encontramos el producto en la base de datos, intenta nuevamente'})
        } else{
            res.status(200).json({msg: 'Stock actualizado'})
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const getCart = async (req, res) => {
    try {
        const result = await productServices.getUserCart(req.userId)
        if(result === 404){
            res.status(404).json({msg: 'Tuvimos un problema, comunicate con un administrador'})
        } else {
            res.status(200).json(result)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const getFavorites = async (req, res) => {
    try {
        const result = await productServices.getUserFavorites(req.userId)
        if(result === 404){
            res.status(404).json({msg: 'Tuvimos un problema, comunicate con un administrador'})
        } else {
            res.status(200).json(result)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const getUltimateProducts = async (req, res) =>{
    try {
        const result = await productServices.getLatestProducts()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

const getProducts = async (req, res) => {
    try {
        const result = await productServices.getAllProducts()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

const getOneProduct = async (req, res) => {
    try {
        const result = await productServices.getOneProduct(req.params.productId)
        if(result === 404){
            res.status(404).json({msg: 'Hubo un problema, intenta nuevamente'})
        } else{
            res.status(200).json(result)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const getOrders = async (req, res) =>{
    try {
        const response = await productServices.getUserOrders(req.userId)
        if(response.statusCode === 404){
            res.status(404).json({msg: response.msg})
        } else{
            res.status(200).json(response.orders)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const searchByWord = async (req, res) =>{
    try {
        const result = await productServices.searchProducts(req.params.keyWord)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateProduct = async (req, res) => {
    try {
        const result = await productServices.productUpdate(req.params.productId, req.body)
        if(result === 400){
            res.status(400).json({msg: 'Hubo un problema al actualizar el producto, intenta nuevamente'})
        }
        else if(result === 404){
            res.status(404).json({msg: 'No encontramos el producto en la base de datos'})
        } else{
            res.status(200).json({msg: 'Producto actualizado'})
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const delProductImage = async (req, res) => {
    try {
        const result = await productServices.deleteImageFromProduct(req.params.productId, req.params.imageId)
        if(result === 404){
            res.status(404).json({msg: 'No encontramos el producto en la base de datos'})
        } else if(result === 400){
            res.status(400).json({msg: 'No encontramos la imagen en el producto'})
        } else{
            res.status(200).json({msg: 'Imagen eliminada del producto'})
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteProduct = async (req, res) => {
    try {
        const result = await productServices.delProduct(req.params.productId)
        if(result === 404){
            res.status(404).json({msg: 'No encontramos el producto en la base de datos'})
        } else{
            res.status(200).json({msg: 'Producto eliminado'})
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    createProduct,
    uploadToCloud,
    deleteFromCloud,
    setMainPicture,
    addProductImage,
    productState,
    addToCart,
    delFromCart,
    addToFavorite,
    delFromFavorite,
    mpPayment,
    changeProductStock,
    getCart,
    getFavorites,
    getUltimateProducts,
    getProducts,
    getOneProduct,
    getOrders,
    searchByWord,
    updateProduct,
    delProductImage,
    deleteProduct
}