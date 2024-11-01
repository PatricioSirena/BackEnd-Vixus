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
const { check } = require('express-validator');
const validateFields = require('../helpers/validateFields');


router.post('/', [
    check('fullName', 'El nombre es requerido y debe tener entre 4 y 50 caracteres').isLength({min: 4, max:50}),
    check('email', 'No es un correo electronico valido').isEmail(),
    check('password', 'La contraseña es requerida y debe tener entre 8 y 20 caracteres').isLength({min: 8, max: 20}),
    check('phone', 'El telefono debe ser un numero y tener entre 6 y 20 caracteres').isLength({min: 6, max:20}).isNumeric(),
    validateFields
], createUser)

router.post('/userState/:userId', [
    check('userId', 'No es un ID valido').isMongoId(),
    validateFields
], auth('admin'), userState)

router.post('/login', [
    check('email', 'No es un correo electronico valido').isEmail(),
    check('password', 'La contraseña es requerida y debe tener entre 8 y 20 caracteres').isLength({min: 8, max: 20}),
    validateFields
], login)

router.get('/', auth('admin'), getUsers)

router.get('/getUser', auth('user'), getOneUser)

router.put('/', [
    check('fullName', 'El nombre es requerido y debe tener entre 4 y 50 caracteres').isLength({min: 4, max:50}),
    check('phone', 'El telefono debe ser un numero y tener entre 6 y 20 caracteres').isLength({min: 6, max:20}).isNumeric(),
    validateFields
], auth('user'), updateUser)

router.delete('/:userId', [
    check('userId', 'No es un ID valido').isMongoId(),
    validateFields
], auth('admin'), deleteUser)

module.exports = router