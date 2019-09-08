'use strict'

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    config = require('../../../config'),
    jwt = require('jsonwebtoken'),
    crypto = require('crypto')

/**
 * A Validation function for password
 */
function validatePassword(password) {
    return password && password.length > 6
}

/**
 * Find possible not used email
 */
function validateUniqueEmail(value, callback) {
    var User = mongoose.model('User')
    User.find({
        $and: [{
                email: value
            }, {
            _id: {
                $ne: this._id
            }
        }]
    }, (err, user) => {
        callback(err || user.length === 0)
    })
}

/**
 * User Schema
 */
var UserSchema = new Schema({
    first_name: {
        type: String,
        trim: true,
        default: '',
        required : true
    },
    last_name: {
        type: String,
        trim: true,
        default: '',
        required : true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        default: '',
        required : true,
        validate: [validateUniqueEmail, 'email_exists'],
        match: [/.+\@.+\..+/, 'email_invalid']
    },
    password: {
        type: String,
        default: '',
        validate: [validatePassword, 'password_length'],
        set: function(password) {
            this._previous_password = this.password;
            return password;
        }
    },
    salt: {
        type: String
    },
    roles: {
        type: [{
            type: String,
            enum: ['user', 'admin', 'owner']
        }],
        default: ['user']
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    },
    reset_password: {
        type: String
    }
})

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
    // Don't salt twice
    if (validatePassword(this.password) && this._previous_password !== undefined) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64')
        this.password = this.hashPassword(this.password)
    }

    next()
})

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'SHA1').toString('base64')
    } else {
        return password
    }
}

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.passwordMatches = function(password) {
    return validatePassword(password) && this.password === this.hashPassword(password)
}

/**
 * Create instance method for a token
 */
UserSchema.methods.token = function() { 
    return jwt.sign({
        _id: this._id,
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email, 
        roles: this.roles,
    }, config.secret, { expiresIn: '5h' })
}

UserSchema.index({ email: 1})
module.exports = mongoose.model('User', UserSchema)