const express = require('express')
const router = express.Router()

router.post('/')

router.post('/mainPicture/:productId')

router.post('/addProductImage/:productId')

router.post('/productState/:productId')

router.post('/addToCart/:productId')

router.post('/delFromCart/:productId')

router.post('/addToFavorite/:productId')

router.post('/delFromFavorite/:productId')

router.get('/')

router.get('/:productId')

router.get('/getCart')

router.get('/getFavorites')

router.put('/:productId')

router.delete('/delProductImage/:productId/galery/:imageId')

router.delete('/:productId')

module.exports = router