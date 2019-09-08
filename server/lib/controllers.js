const glob = require('glob'),
    config = require('../config')

/**
 * Controllers
 * Controll the requests and data.
 */
class Controllers {

    /**
     * Load all of the controller files
     */
    load(server ) {
        var files = glob.sync('server/routes/**/*_controller.js')

        files.forEach(function(file) {
            require(config.base + file)(server)
        })

    }

}

module.exports = new Controllers()
