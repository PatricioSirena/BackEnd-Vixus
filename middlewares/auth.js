const jwt = require('jsonwebtoken')

module.exports = (role) => (req, res, next) => {
    const token = req.header('auth')
    console.log(token)
    if (!token) {
        return res.status(409).json({ msg: 'No recibimos el token para autorizarlo' })
    }
    try {         
            const verify = jwt.verify(token, process.env.JWT_KEY)

            if(role === verify.role) {
                req.userId = verify.id
                return next()
            } else {
                return res.status(401).json({ msg: 'No tenes acceso' })
            }

    } catch (error) {
        if(error.name === 'JsonWebTokenError'){
            return res.status(401).json({ msg: 'Token invalido' })
        }else{
            console.log(error);
            return res.status(500).json({ msg: 'Error interno' })
        }
    }
}