const express = require('express')
const router = express.Router()

router.post('/')

router.post('/userState/:userId')

router.post('/login')

router.post('/profilePicture')

router.get('/')

router.get('/:userId')

router.put('/')

router.delete('/:userId')

module.exports = router