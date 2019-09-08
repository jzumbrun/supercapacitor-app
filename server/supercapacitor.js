const fs = require('fs'),
    config = require('./config'),
    parser = require('body-parser'),
    compression = require('compression'),
    jwt = require('express-jwt'),
    database = require('./lib/database'),
    logger = require('./lib/logger'),
    site = require('./lib/site'),
    _ = require('./lib/mixins'),

    // Finally the server object
    express = require('express'),
    server = express(),
    http = require('http')

/**
 *  Define the server
 */
class Supercapacitor {

    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    terminator(sig) {
        if (typeof sig === 'string') {
            console.log('%s: Received %s - terminating server ...',
                Date.now(), sig)
            process.exit(1)
        }
        console.log('%s: Node server stopped.', Date.now())
    }

    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    setupTerminationHandlers() {

        // Removed 'SIGPIPE' from the list - bugz 852598.
        let signals = ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
            'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ]
        signals.forEach((signal) => {
            process.on(signal, () => this.terminator(signal))
        })
    }

    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    initialize() {

        server.enable('trust proxy');
        server.use(compression())
        server.use(express.static(config.base + '/public'))
        server.use(parser.json())
        server.use(parser.urlencoded({ extended: true }))

        // Serve the entry point
        server.get('/', (req, res) => res.sendFile(config.base + '/public/index.html'))

        // View engine setup
        server.set('view engine', 'ejs')

        // We are going to protect routes with JWT
        server.use(jwt({
            secret: config.secret
        }).unless({
            path: config.open_paths
        }))

        // Stream info logs now
        logger.streamInfo()
        server.use((req, res, next) => {
            logger.info({action: 'navigated', drilldown: req.method.toLowerCase() + '.' + req.url})
            next()
        })

        // Build the site
        site.build(server)

        // Error handlers
        this.errors()

        // Connect to mongoDB
        database.connect()

    }

    /**
     *  Set Error Handlers
     */
    errors() {

        server.use((err, req, res, next) => {
            if (err.constructor.name === 'UnauthorizedError') {
                res.status(401).send('unauthorized')
            }
        })

        // catch 404 and forward to error handler
        server.use((req, res, next) => {
            let err = new Error('not_found')
            err.status = 404
            next(err)
        })

        // development error handler
        // will print stacktrace
        if (config.env === 'development') {
            server.use((err, req, res, next) => {
                res.status(err.status || 500)
                res.send({
                    message: err.message,
                    error: err
                })
            })
        }

    }

    getCerts() {
        var certs = {};
        _.each(config.certs, (v, k) => certs[k] = fs.readFileSync(`${config.base}server/certs/${v}`))
        return certs
    }

    /**
     *  Start the server (starts up the sample serverlication).
     */
    start() {
        // Lets start the fatal logging before anything
        logger.streamFatal()

        this.setupTerminationHandlers()

        // Create the express server and routes.
        this.initialize()

        // Non secure
        http.createServer(server).listen(config.port, (err) => {
            console.log('Supercapacitor App started at %s on %s:%d ...', Date.now(), '127.0.0.1', config.port)
        })
    }

}

var supercapacitor = new Supercapacitor()
supercapacitor.start()