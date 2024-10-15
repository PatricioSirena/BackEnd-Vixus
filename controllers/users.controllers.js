const userServices = require('../services/users.services')
const logger = require('../helpers/logger')

const createUser = async (req, res) => {
    try {
        const result = await userServices.register(req.body)
        if (result === 401) {
            res.status(401).json({ msg: `Ya existe un usuario registrado con el correo ${req.body.email}` })
        } else if (result === 406) {
            res.status(406).json({ msg: 'Tuvimos un inconveniente con los datos recibidos, intenta nuevamente' })
        } else {
            res.status(201).json({ msg: 'Usuario registrado' })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const userState = async (req, res) => {
    try {
        const result = await userServices.changeUserState(req.params.userId)
        if (result === 404) {
            res.status(404).json({ msg: 'No encontramos el usuario en la base de datos' })
        } else {
            res.status(200).json(result)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const login = async (req, res) => {
    try {
        const result = await userServices.signIn(req.body)
        if (result.statusCode === 404) {
            res.status(404).json({ msg: `No existe un usuario registrado con el correo ${req.body.email}` })
        } else if (result.statusCode === 401) {
            res.status(401).json({ msg: `Usuario bloqueado, contactate con soporte` })
        } else if (result.statusCode === 406) {
            res.status(406).json({ msg: 'Contraseña incorrecta' })
        } else {
            res.status(200).json({ msg: result.msg, token: result.token, role: result.role, id: result.id })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

// const setProfilePicture = async (req, res) =>{
//     try {

//     } catch (error) {
//         res.status(500).json(error)
//     }
// }

const getUsers = async (req, res) => {
    try {
        const result = await userServices.getAllUsers()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

const getOneUser = async (req, res) => {
    try {
        const result = await userServices.getOneUser(req.userId)
        if (result === 404) {
            res.status(404).json({ msg: 'No encontramos el usuario en la base de datos' })
        } else {
            res.status(200).json(result)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateUser = async (req, res) => {
    try {
        const result = await userServices.userToUpdate(req.userId, req.body)
        if (result === 401) {
            res.status(401).json({ msg: 'Algunos datos ingresados no se pueden modificar, intenta nuevamente' })
        } else if (result === 404) {
            res.status(404).json({ msg: 'No encontramos el usuario en la base de datos' })
        } else {
            res.status(200).json(result)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteUser = async (req, res) => {
    try {
        const result = await userServices.userToDelete(req.params.userId)
        if(result === 404){
            res.status(404).json({msg: 'No encontramos al usuario en la base de datos'})
        } else{
            res.status(200).json(result)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    createUser,
    userState,
    login,
    // setProfilePicture,
    getUsers,
    getOneUser,
    updateUser,
    deleteUser
}