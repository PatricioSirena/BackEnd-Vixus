const express = require('express')
const router = express.Router()
const { createProduct,
    createVariant,
    stockPerSize,
    createCategory,
    uploadToCloud,
    deleteFromCloud,
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
    deleteCategory } = require('../controllers/products.controllers')
const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer')
const { check } = require('express-validator')
const validateFields = require('../helpers/validateFields')


router.post('/', [
    check('name', 'El nombre es requerido y debe tener entre 4 y 40 caracteres').isLength({ min: 4, max: 40 }).isString(),
    check('price', 'El precio es requerido y debe ser un número').isNumeric(),
    check('description', 'La descripción es requerida y debe tener entre 10 y 200 caracteres').isLength({ min: 10, max: 200 }),
    validateFields
], auth(['admin', 'mainAdmin']), createProduct)

router.post('/createVariant/:productId', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    check('color', 'El color de la variante es requerido y debe tener entre 4 y 30 caracteres').isLength({ min: 4, max: 30 }).isString(),
    validateFields
], auth(['admin', 'mainAdmin']), createVariant)

router.post('/stockPerSize', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    check('variantId', 'El ID de la variante es requerido').isMongoId(),
    check('size', 'Debe ingresar el talle').isLength({ min: 1 }),
    check('stock', 'El stock es requerido y debe ser un número').isNumeric(),
    validateFields
], auth(['admin', 'mainAdmin']), stockPerSize)


router.post('/createCategory', [
    check('name', 'El nombre de la categoría es requerido, debe tener entre 4 y 30 caracteres').isLength({ min: 4, max: 30 }),
    validateFields
], auth(['admin', 'mainAdmin']), createCategory)

router.post('/uploadToCloud', auth(['admin', 'mainAdmin']), multer.single('image'), uploadToCloud)

router.post('/deleteFromCloud', auth(['admin', 'mainAdmin']), deleteFromCloud)

router.post('/addProductImage', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    check('variantId', 'No es un ID valido de una variante').isMongoId(),
    check('imageUrl', 'La URL de la imagen es requerida').isLength({ min: 1 }),
    validateFields
], auth(['admin', 'mainAdmin']), addProductImage)

router.post('/productState/:productId', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    validateFields
], auth(['admin', 'mainAdmin']), productState)

router.post('/addToCart', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    check('variantId', 'El ID de la variante no es valido').isMongoId(),
    check('sizeId', 'El ID del talle no es valido').isMongoId(),
    validateFields
], auth(['user']), addToCart)

router.post('/delFromCart/:productInCartId', [
    check('productInCartId', 'No es un ID valido').isMongoId(),
    validateFields
], auth(['user']), delFromCart)

router.post('/addToFavorite', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    check('variantId', 'El ID de la variante no es valido').isMongoId(),
    validateFields
], auth(['user']), addToFavorite)

router.post('/delFromFavorite/:productInFavId', [
    check('productInFavId', 'No es un ID valido de un producto').isMongoId(),
    validateFields
], auth(['user']), delFromFavorite)

router.post('/mpPayment', auth(['user']), mpPayment)

router.post('/addCategoryToProd/:productId/:categoryName', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    check('categoryName', 'No recibimos la categoria para agregar al producto').isLength({ min: 1 }),
    validateFields
], auth(['admin', 'mainAdmin']), addCategoryToProd)

router.post('/delCategoryFromProd/:productId/:categoryName', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    check('categoryName', 'No recibimos el nombre de la categoria').isLength({ min: 1 }),
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
    check('categoryName', 'El nombre de la categoría es requerido').isString({ min: 1 }),
    validateFields
], productsByCategory)

router.get('/search/:keyWord', searchByWord)

router.put('/:productId', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    validateFields
], auth(['admin', 'mainAdmin']), updateProduct)

router.delete('/delProductImage', [
    check('productId', 'No es un ID valido de un producto').isMongoId(),
    check('variantId', 'El ID de la variante no es valido').isMongoId(),
    check('imageId', 'El ID de la imagen no es valido').isMongoId(),
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