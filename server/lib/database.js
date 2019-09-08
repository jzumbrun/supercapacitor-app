const mongoose = require('mongoose'),
    config = require('../config')

class Database {

    /**
     * Open a connection to the database
     * @param conf
     */
    connect() {
        mongoose.connect('mongodb://' + config.db.host + '/' + config.db.database)
        mongoose.connection.on('error', console.error.bind(console, 'connection error:'))
        mongoose.connection.once('open', () => {
            console.log('db connection open to ' + config.db.database)
        })
    }
}

module.exports = new Database()