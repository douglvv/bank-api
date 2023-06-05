const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/bank-api', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        console.log('Conectado no mongo TB')
    } catch (error) {
        console.log('Error connection do MongoDB',error)
    }
}

connect()


module.exports = mongoose

