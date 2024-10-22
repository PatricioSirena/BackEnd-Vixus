const express = require('express')
const router = express.Router()
const {
    createUser,
    userState,
    login,
    getUsers,
    getOneUser,
    updateUser,
    deleteUser
} = require('../controllers/users.controllers')
const auth = require('../middlewares/auth')


router.post('/', createUser)

router.post('/userState/:userId', auth('admin'), userState)

router.post('/login', login)

router.get('/', auth('admin'), getUsers)

router.get('/getUser', auth('user'), getOneUser)

router.put('/', auth('user'), updateUser)

router.delete('/:userId', auth('admin'), deleteUser)

module.exports = router