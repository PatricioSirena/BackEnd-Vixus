const express = require('express')
const router = express.Router()
const { createProduct,
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
    deleteProduct } = require('../controllers/products.controllers')
const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer')


router.post('/', auth('admin'), createProduct)

router.post('/mainPicture/:productId', multer.single('image'), setMainPicture)

router.post('/addProductImage/:productId', multer.single('image'), addProductImage)

router.post('/productState/:productId', auth('admin'), productState)

router.post('/addToCart/:productId', auth('user'), addToCart)

router.post('/delFromCart/:productId', auth('user'), delFromCart)

router.post('/addToFavorite/:productId', auth('user'), addToFavorite)

router.post('/delFromFavorite/:productId', auth('user'), delFromFavorite)

router.get('/getCart', auth('user'), getCart)

router.get('/getFavorites', auth('user'), getFavorites)

router.get('/', getProducts)

router.get('/:productId', getOneProduct)

router.put('/:productId', auth('admin'), updateProduct)

router.delete('/delProductImage/:productId/galery/:imageId', auth('admin'), delProductImage)

router.delete('/:productId', auth('admin'), deleteProduct)

module.exports = router