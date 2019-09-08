'use strict'

const _ = require('lodash'),
    mongoose = require('mongoose')

module.exports = (server) => {

    /**
     * Delivered
     * This is an image so it needs to be a get request
     * event though its an update
     */
    server.get('/home/:_id/me', async (req, res) => {
        var User = mongoose.model('User'),
            user = await User.findOne({_id: req.params._id})

        res.send({first_name: user.first_name})
    })
}