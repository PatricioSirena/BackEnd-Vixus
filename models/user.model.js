const { model, Schema } = require('mongoose')

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName:{
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: Number,
        required: true,
        trim: true
    },
    profilePicture:{
        type: String,
        default: ''
    },
    passwordToken:{
        type:String,
        default: null
    },
    active: {
        type: Boolean,
        default: true
    },
    role:{
        type:String,
        default:'user',
        enum:['user', 'admin']
    },
    cartId:{
        type: String
    },
    favoriteId:{
        type: String
    }
})

UserSchema.methods.toJSON = function(){
    const {password, passwordToken, __v, ...user} = this.toObject()
    return user
}

const UserModel = model('user', UserSchema)

module.exports = UserModel