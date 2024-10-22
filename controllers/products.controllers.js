const productServices = require('../services/products.services')
const logger = require('../helpers/logger')

const createProduct = async (req, res) => {
    try {
        const result = await productServices.newProduct(req.body)
        if (result === 201) {
            res.status(201).json({ msg: 'Producto creado con exito' })
        } else {
            res.status(400).json({ msg: `El producto ${req.body.name} ya existe en la base de datos` })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const setMainPicture = async (req, res) =>{
    try {

    } catch (error) {
        res.status(500).json(error)
    }
}

const addProductImage = async (req, res) =>{
    try {

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
            res.status(404).json({msg: 'No encontramos el producto en la base de datos'})
        } else{
            res.status(200).json(result)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateProduct = async (req, res) => {
    try {
        const result = await productServices.productUpdate(req.params.productId, req.body)
        if(result === 404){
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
    setMainPicture,
    addProductImage,
    productState,
    addToCart,
    delFromCart,
    addToFavorite,
    delFromFavorite,
    getCart,
    getFavorites,
    getProducts,
    getOneProduct,
    updateProduct,
    delProductImage,
    deleteProduct
}