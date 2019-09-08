const _ = require('lodash'),
    config = require('../config'),
    nodemailer = require('nodemailer')

/**
 * Mailer
 * Merge config defaults and send single or multiple mails
 *
 * @param (object) express server
 */
class Mailer {

    constructor(server) {
        this.server = server
        this.options = {}
        this.transporter = nodemailer.createTransport(config.sparkpost.smtp)
    }

    /**
     * Set Defaults
     * Prep the config defaults, send the message
     *
     * @param (literal) options
     * @return (object) smtpTransport
     */
    setDefaults(options) {

        this.options = options

        // always force messages to be an array for convenience
        if (!_.isArray(this.options.message)) {
            this.options.message = [this.options.message]
        }

        // add mail if no parent dir is listed
        if (this.options.view.split('/').length) {
            this.options.view = 'mail/' + this.options.view
        }

    }

    /**
     * Transport
     * Loops through messages applying the view, then send mail
     *
     * @return (object) smtpTransport
     */
    transport() {

        // we will always loop even on one message
        this.options.message.forEach((message) => {

            // render the view and set the output to the message html
            this.server.render(this.options.view, message.data, (err, out) => {
                message.html = out
                this.sendMail(message)
            })
        })
    }

    sendMail(message){
        this.transporter.sendMail({
            from: config.sparkpost.from,
            to: message.to,
            subject: message.subject,
            html: message.html
        }, (err, info) => {
            if (err) {
                console.log(err)
            }
        })
    }

    /**
     * Send
     * Send the message using SMTP
     *
     * @param (literal) options
     * @return (object) smtpTransport
     */
    send(options) {
        this.setDefaults(options)
        return this.transport()
    }

}

/**
 * Mailer
 *
 * @param (server) express server
 */
module.exports = (server) => {
    return new Mailer(server)
}
