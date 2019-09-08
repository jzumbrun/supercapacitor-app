const _ = require('lodash'),
    glob = require('glob'),
    config = require('../config')

/**
 * Models
 * Manage schema and data from the database.
 */
class Models {

    /**
     * Load all the models
     */
    load() {
        const files = glob.sync('server/routes/**/*_model.js')

        files.forEach((file) => {
            // Save it to the server as ModelnameModel
            require(config.base + file)
        })

    }

}

module.exports = new Models()
