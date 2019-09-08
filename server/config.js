const config = {}

/** DEFAULTS **/
config.defaults = {
    domain: 'http://localhost:7777',
    port: 7777,
    certs: {
        key: 'dev.key',
        cert: 'dev.crt'
    },

    secret: '29d8ejficfkjsocf',
    aws: {
        access_key_id: '123',
        secret_access_key: '123'
    },

    open_paths: [
        '/',
        '/users/signin',
        '/users/signup',
        '/users/forgot',
        '/users/reset'
    ],

    logger: {
        fatal: {
            to: 'jz@something.com',
            from: 'fatal@something.com'
        }
    },

    sparkpost: {
        smtp: {
            service:'Sparkpost',
            auth: {
                user: 'SMTP_Injection',
                pass: '123456'
            }
        },
        from: 'Supercapacitor <postmaster@something.com>',
        subject: 'Supercapacitor'
    }
}

/** DEVELOPMENT **/
config.development = {
    db: {
        host: 'localhost',
        database: 'supercapacitor'
    }
}

/** TESTING **/
config.testing = {

    db: {
        host: 'localhost',
        database: 'supercapacitor'
    }
}

/** STAGING **/
config.staging = {

    db: {
        host: 'localhost',
        database: 'supercapacitor'
    }
}

/** PRODUCTION **/
config.production = {
    db: {
        host: 'localhost',
        database: 'supercapacitor'
    }
}

/* !!! DONT CHANGE THIS LINE !!! */
module.exports = (new function(){config.defaults.base=process.cwd()+'/';config.defaults.env=require(config.defaults.base+'.env');return require('lodash').merge(config.defaults,config[config.defaults.env])}())