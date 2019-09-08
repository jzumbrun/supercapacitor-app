const Bunyan = require('bunyan'),
    config = require('../config'),
    AWS = require('aws-sdk'),
    bunyanFirehose = require('bunyan-firehose'),
    BunyanNodeMailer = require('bunyan-nodemailer')

/**
 * Logger
 * Log stuff
 */
class Logger {

    constructor(){
        this.logger = new Bunyan({
            name: 'scridly',
            serializers: Bunyan.stdSerializers
        })
    }

    /**
     * Stream info
     */
    streamInfo(){
        var stream = bunyanFirehose.createStream({
            streamName:  'scridly-logs',
            region: 'us-east-1',
            delimiter: "\n",
            credentials: new AWS.Credentials({
                accessKeyId:     config.aws.access_key_id,
                secretAccessKey: config.aws.secret_access_key
        })})
        this.logger.addStream({
            type: 'raw',
            level: 'info',
            stream: stream
        })

    }

    /**
     * Stream Fatal
     */
    streamFatal(){
        var stream = new BunyanNodeMailer({
            from: config.logger.fatal.from,
            to: config.logger.fatal.to,
            transport: config.sparkpost.smtp
        })
        this.logger.addStream({
            type: 'raw',
            level: 'fatal',
            stream: stream
        })

        // Catch and email fatal issues
        process.on('uncaughtException', err => {
            this.logger.fatal(err, 'Uncaught Exception')
            process.exit(1);
        })
    }

    /**
     * Info level
     */
    info() {
        if (config.env === 'production') this.logger.info.apply(this.logger, arguments)
    }

    /**
     * Fatal level
     */
    fatal() {
        if (config.env === 'production') this.logger.fatal.apply(this.logger, arguments)
    }

}

module.exports = new Logger()