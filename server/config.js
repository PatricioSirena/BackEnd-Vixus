require('../db/dbConfig')
const express = require('express')
const path = require('path')
const cors = require('cors')
const morgan = require('morgan')

class Server {
    constructor(){
        this.app = express()
        this.port = process.env.PORT || 4041
        this.middlewares()
        this.routes()
    }

    middlewares(){
        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname, '../public')))
        this.app.use(cors())
        this.app.use(morgan('dev'))
    }

    routes(){
        this.app.use('api/users', require('../routes/users.route'))
        this.app.use('api/products', require('../routes/products.route'))
    }

    listen(){
        this.app.listen(this.port, () => { console.log('Servidor conectado en puerto', this.port);
        })
    }
}

module.exports = Server
