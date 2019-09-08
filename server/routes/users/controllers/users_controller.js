'use strict'

var crypto = require('crypto'),
    mongoose = require('mongoose'),
    config = require('../../../config')

module.exports = (server) => {
    
    /**
     * Users
     */
    server.put('/users', (req, res) => {
        var User = mongoose.model('User')

        User.findOne({
            _id: req.user._id
        }, (err, user) => {

            // If something weird happens, abort.
            if (err || !user) {
                return res.status(422).send({errors: {user: {message: 'user_not_found'}}})
            }
            
            if(req.body.password){
                user.password = req.body.password
            }

            user.first_name = req.body.first_name
            user.last_name = req.body.last_name
            user.email = req.body.email

            user.save((err) => {
                if (err) {
                    return res.status(422).send(err)
                }

                res.send({ token: user.token() })
            })
        })
    })

    /**
     * Sign in
     */
    server.put('/users/signin', async (req, res) => {
        try { 

            var User = mongoose.model('User'),
            user = await User.findOne({
                email: req.body.email,
                // Do NOT allow admin users. Let's keep them separate.
                roles: {$in: ['user']}
            })

            if(!user || !user.passwordMatches(req.body.password)){
                return res.status(422).send({errors: {password: {message: 'email_or_password_wrong'}}})
            }

            res.send({ token: user.token() })
    
        } catch(e) {
            return res.status(422).send({errors: {email: {message: 'email_or_password_wrong'}}})
        }

    })

    /**
     * Sign up
     */
    server.post('/users/signup', (req, res) => {

        var User = mongoose.model('User'),
            user = new User()

        // Now lets add a user
        user.roles = ['user', 'owner']
        user.first_name = req.body.first_name
        user.last_name = req.body.last_name
        user.email = req.body.email
        user.password = req.body.password
        user.save((err) => {
            if (err) {
                return res.status(422).send(err)
            }
            res.send({ token: user.token() })
        })
    })

    /**
     * Forgot
     */
    server.put('/users/forgot', (req, res) => {
        var User = mongoose.model('User'),
            mail = require(config.base + 'server/lib/mailer')(server),
            message = {}

        User.findOne({
            email: req.body.email
        }, (err, user) => {

            // If something weird happens, abort.
            if (err || !user) {
                // We send reset_email_sent for security reasons
                return res.status(422).send({errors: {email: {message: 'reset_email_sent'}}})
            }
            
            user.reset_password = crypto.randomBytes(16).toString('hex')
            user.save((err) => {
                
                if (err) {
                    return res.status(422).send(err)
                }
                
                message = mail.send({
                    view: 'forgot',
                    message: {
                        subject: 'Supercapacitor Password Reset',
                        to: user.email,
                        data: {
                            first_name: user.first_name, 
                            url: 'http://' + req.headers.host + '/#/users/reset/' + user._id + '/' + user.reset_password}
                    }
                })
                res.send({message: 'reset_email_sent'})
            })

        })
    })
    
    /**
     * Reset
     */
    server.put('/users/reset', (req, res) => {
        var User = mongoose.model('User')

        User.findOne({
            _id: req.body._id,
            reset_password: req.body.reset_password
        }, (err, user) => {

            // If something weird happens, abort.
            if (err || !user) {
                return res.status(422).send({errors: {email: {message: 'reset_password_wrong'}}})
            }

            user.reset_password = ''
            user.password = req.body.password
            user.save((err) => {
                if (err) {
                    return res.status(422).send(err)
                }
                res.send({ token: user.token() })
            })

        })
    })

}