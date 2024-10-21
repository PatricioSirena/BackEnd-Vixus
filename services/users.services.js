const UserModel = require('../models/user.model')
const CartModel = require('../models/cart.model')
const FavModel = require('../models/favorite.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const logger = require('../helpers/logger')
const {registroUsuario} = require('../helpers/nodemailer.messages')

const register = async (body) => {
    try {
        const userExist = await UserModel.findOne({ email: body.email })
        if (userExist) {
            return 401
        }
        if (body.role !== undefined) {
            return 406
        }

        const salt = bcrypt.genSaltSync()
        body.password = bcrypt.hashSync(body.password, salt)
        const user = new UserModel(body)
        const userCart = new CartModel({ userId: user._id })
        const userFav = new FavModel({ userId: user._id })
        user.cartId = userCart._id
        user.favoriteId = userFav._id
        await user.save()
        await userCart.save()
        await userFav.save()
        registroUsuario(user.email)
        return 201

    } catch (error) {
        logger.error(error)
    }
}

const changeUserState = async (userId) => {
    try {
        const user = await UserModel.findById({ _id: userId })
        if (user === null) {
            return 404
        } else {
            user.active = !user.active
            await user.save()
            if (user.active) {
                return { msg: 'Usuario activado' }
            } else {
                return { msg: 'Usuario desactivado' }
            }
        }
    } catch (error) {
        logger.error(error)
    }
}

const signIn = async (body) =>{
    try {
        const userExist = await UserModel.findOne({ email: body.email })
        if (!userExist) {
            return {statusCode: 404}
        }else if(!userExist.active){
            return {statusCode: 401}
        }
        
        const passwordVerify = bcrypt.compareSync(body.password, userExist.password)
        if (!passwordVerify) {
            return {statusCode: 406}
        }else{
            const payload = {
                id: userExist._id,
                role: userExist.role
            }
            const token = jwt.sign(payload, process.env.JWT_KEY)
            return {
                statusCode: 200,
                token,
                msg: 'Usuario logueado',
                role: userExist.role,
                id: userExist._id
            }
        }
    } catch (error) {
        logger.error(error)
    }
}

const getAllUsers = async () =>{
    try {
        const users = await UserModel.find()
        return users
    } catch (error) {
        logger.error(error)
    }
}

const getOneUser = async (userId) =>{
    try {
        const user = await UserModel.findById(userId)
        if(user === undefined){
            return 404
        } else{
            return user
        }
    } catch (error) {
        logger.error(error)
    }
}

const userToUpdate = async (userId, body) =>{
    try {
        if (body.email || body.password || body.profilePicture || body.passwordToken || body.active || body.active === false || body.role || body.cartId || body.favoriteId ){
            return 401
        }
        const updatedUser = await UserModel.findByIdAndUpdate({_id: userId}, body, {new: true})
        if(updatedUser === null){
            return 404
        } else{
            return updatedUser
        }
    } catch (error) {
        logger.error(error)
    }
}

const userToDelete = async (userId) =>{
    try {
        const user = await UserModel.findById(userId)
        if(user === null){
            return 404
        } else{
            await UserModel.findByIdAndDelete(userId)
            await FavModel.findByIdAndDelete({_id: user.favoriteId})
            await CartModel.findByIdAndDelete({_id: user.cartId})
            return {msg: 'Usuario eliminado'}
        }
    } catch (error) {
        logger.error(error)
    }
}

module.exports = {
    register,
    changeUserState,
    signIn,
    getAllUsers,
    getOneUser,
    userToUpdate,
    userToDelete
}

