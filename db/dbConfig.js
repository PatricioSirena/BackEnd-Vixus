const mongoose = require('mongoose')

try {
    mongoose.connect(process.env.MONGO_DB_CNN).then(() => console.log('Base de datos conectada'))
} catch (error) {
    console.log(error)
}

module.exports = mongoose