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
    mpPayment,
    getCart,
    getFavorites,
    getProducts,
    getOneProduct,
    updateProduct,
    delProductImage,
    deleteProduct } = require('../controllers/products.controllers')
const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer')
const { check, param } = require('express-validator')
const validateFields = require('../helpers/validateFields')


router.post('/', [
    check('name', 'El nombre es requerido y debe tener entre 4 y 40 caracteres').isLength({ min: 4, max: 40 }).isString(),
    check('price', 'El precio es requerido y debe ser un número').isNumeric(),
    check('description', 'La descripción es requerida y debe tener entre 10 y 200 caracteres').isLength({ min: 10, max: 200 }),
    validateFields
], auth('admin'), createProduct)

router.post('/mainPicture/:productId', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    validateFields
], auth('admin'), multer.single('image'), setMainPicture)

router.post('/addProductImage/:productId', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    validateFields
], auth('admin'), multer.single('image'), addProductImage)

router.post('/productState/:productId', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    validateFields
], auth('admin'), productState)

router.post('/addToCart/:productId', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    validateFields
], auth('user'), addToCart)

router.post('/delFromCart/:productId', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    validateFields
], auth('user'), delFromCart)

router.post('/addToFavorite/:productId', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    validateFields
], auth('user'), addToFavorite)

router.post('/delFromFavorite/:productId', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    validateFields
], auth('user'), delFromFavorite)

router.post('/mpPayment', auth('user'), mpPayment)

router.get('/getCart', auth('user'), getCart)

router.get('/getFavorites', auth('user'), getFavorites)

router.get('/', getProducts)

router.get('/:productId', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    validateFields
], getOneProduct)

router.put('/:productId', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    validateFields
], auth('admin'), updateProduct)

router.delete('/delProductImage/:productId/galery/:imageId?', [
    param('productId', 'No es un ID valido de un producto').isMongoId(),
    param('imageId', 'El ID de la imagen es requerido').isLength({min: 1}),
    validateFields
], auth('admin'), delProductImage)

router.delete('/:productId', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    validateFields
], auth('admin'), deleteProduct)

module.exports = router