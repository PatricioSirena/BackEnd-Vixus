const express = require('express')
const router = express.Router()
const { createProduct,
    createCategory,
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
    addCategoryToProd,
    delCategoryFromProd,
    getCart,
    getFavorites,
    getUltimateProducts,
    getProducts,
    getOneProduct,
    productsByCategory,
    getOrders,
    getCategories,
    searchByWord,
    updateProduct,
    delProductImage,
    deleteProduct,
    deleteCategory} = require('../controllers/products.controllers')
const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer')
const { check, param } = require('express-validator')
const validateFields = require('../helpers/validateFields')


router.post('/', [
    check('name', 'El nombre es requerido y debe tener entre 4 y 40 caracteres').isLength({ min: 4, max: 40 }).isString(),
    check('price', 'El precio es requerido y debe ser un número').isNumeric(),
    check('description', 'La descripción es requerida y debe tener entre 10 y 200 caracteres').isLength({ min: 10, max: 200 }),
    validateFields
], auth(['admin', 'mainAdmin']), createProduct)

router.post('/createCategory', [
    check('name', 'El nombre de la categoría es requerido, debe tener entre 4 y 30 caracteres').isLength({ min: 4, max: 30}),
    validateFields
], auth(['admin', 'mainAdmin']), createCategory)

router.post('/uploadToCloud', auth(['admin', 'mainAdmin']), multer.single('image'), uploadToCloud)

router.post('/deleteFromCloud', auth(['admin', 'mainAdmin']), deleteFromCloud)

router.post('/mainPicture/:productId', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    validateFields
], auth(['admin', 'mainAdmin']), setMainPicture)

router.post('/addProductImage/:productId', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    validateFields
], auth(['admin', 'mainAdmin']), addProductImage)

router.post('/productState/:productId', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    validateFields
], auth(['admin', 'mainAdmin']), productState)

router.post('/addToCart/:productId', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    validateFields
], auth(['user']), addToCart)

router.post('/delFromCart/:productId', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    validateFields
], auth(['user']), delFromCart)

router.post('/addToFavorite/:productId', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    validateFields
], auth(['user']), addToFavorite)

router.post('/delFromFavorite/:productId', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    validateFields
], auth(['user']), delFromFavorite)

router.post('/mpPayment', auth(['user']), mpPayment)

router.post('/addCategoryToProd/:productId/:categoryId', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    check('categoryId', 'No es un ID valido de una categoría').isMongoId(),
    validateFields
], auth(['admin', 'mainAdmin']), addCategoryToProd)

router.post('/delCategoryFromProd/:productId/:categoryId', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    check('categoryId', 'No es un ID valido de una categoría').isMongoId(),
    validateFields
], auth(['admin', 'mainAdmin']), delCategoryFromProd)

router.get('/getCart', auth(['user']), getCart)

router.get('/getFavorites', auth(['user']), getFavorites)

router.get('/getUltimateProducts', getUltimateProducts)

router.get('/getOrders', auth(['user']), getOrders)

router.get('/', getProducts)

router.get('/getCategories', getCategories)

router.get('/:productId', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    validateFields
], getOneProduct)

router.get('/productsByCategory/:categoryName', [
    check('categoryName', 'El nombre de la categoría es requerido').isString({min: 1}),
    validateFields
], productsByCategory)

router.get('/search/:keyWord', searchByWord)

router.put('/:productId', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    validateFields
], auth(['admin', 'mainAdmin']), updateProduct)

router.delete('/delProductImage/:productId/galery/:imageId?', [
    param('productId', 'No es un ID valido de un producto').isMongoId(),
    param('imageId', 'El ID de la imagen es requerido').isLength({min: 1}),
    validateFields
], auth(['admin', 'mainAdmin']), delProductImage)

router.delete('/:productId', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    validateFields
], auth(['admin', 'mainAdmin']), deleteProduct)

router.delete('/deleteCategory/:categoryId', [
    check('categoryId', 'No es un ID valido de una categoría').isMongoId(),
    validateFields
], auth(['admin', 'mainAdmin']), deleteCategory)

module.exports = router