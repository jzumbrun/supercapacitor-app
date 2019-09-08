const controllers = require('./controllers'),
    models = require('./models'),
    layouts = require('./layouts')

/**
 * Site
 * The site containing the code to add to a page
 */
class Site {

    /**
     * Initialize all the things
     */
    build(server) {
        models.load()
        controllers.load(server)
        layouts.load(server)
    }

}

module.exports = new Site()