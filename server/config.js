require('../db/dbConfig')
const express = require('express')
const path = require('path')
const cors = require('cors')
const morgan = require('morgan')
const multer = require('multer')

class Server {
    constructor() {
        this.app = express()
        this.port = process.env.PORT || 4041
        this.middlewares()
        this.routes()
        this.errorHandler()
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname, '../public')))
        this.app.use(cors())
        this.app.use(morgan('dev'))
    }

    routes() {
        this.app.use('/api/users', require('../routes/users.route'))
        this.app.use('/api/products', require('../routes/products.route'))
    }

    errorHandler() {
        this.app.use((error, req, res, next) => {
            console.log('Error capturado:', error.message);
            if (error instanceof multer.MulterError) {
                return res.status(400).json({ message: `Error de Multer: ${error.message}` });
            }
            if (error.message && error.message.includes('no es permitido')) {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error interno del servidor' });
        });
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor conectado en puerto', this.port);
        })
    }
}

module.exports = Server
