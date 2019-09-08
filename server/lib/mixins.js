const _ = require('lodash')

_.mixin({

    // True deep native copy.
    // Neither Object.create(obj), _.clone and _.extend are deep copies
    copy(obj){
        return JSON.parse(JSON.stringify(obj))
    },
    
    capitalize(string) {
        return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase()
    },
    
    uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8)
            return v.toString(16)
        })
    },

    emptyGif() {
        var buff = new Buffer(35)
        buff.write('R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=', 'base64')
        return buff
    },

    base64Decode(str, callback) {
        var output = str.replace('-', '+').replace('_', '/')
        switch (output.length % 4) {
            case 0:
                break
            case 2:
                output += '=='
                break
            case 3:
                output += '='
                break
            default:
                if(_.isFunction(callback)){
                    return callback()
                }
        }
        return window.atob(output)
    },

    // https://github.com/Battlefy/simple-slug
    slug(string){
        return string
        .replace(/\s/g, '-')
        .replace(/[^a-zA-Z0-9 -]+/g, '')
        .replace(/^-+|-+$/g, '')
        .replace(/-+/g, '-')
        .toLowerCase();
    }

})

module.exports = _