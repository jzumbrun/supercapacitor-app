import _ from 'underscore'

_.mixin({

    // Make routing available every where
    route(url, options=[]){
        // JS routes look like: users/somthing
        // Server routes look like /users
        // External routes look like http://some.where

        // If the url does begin with a / or have a . add the #/
        if(url[0] != '/' && url.indexOf('.') === -1){
            url = '#/' + url
        }

        // We have an external site, add target: _blank
        if(url.indexOf('.') > -1 && options._blank !== false) {
            window.open(url, '_blank').focus()
        }
        // Internal js or server route
        else window.location = url
    },

    getRoute(){
        var route = window.location.hash.replace('#/', '').replace(/\/?\?.*$/, '')
        return route || 'home/index'
    },

    // True deep native copy.
    // Neither Object.create(obj), _.clone and _.extend are deep copies
    copy(obj){
        return JSON.parse(JSON.stringify(obj))
    },

    // True deep native equals.
    // Neither Object.is(obj) are good comparitors
    equals(obj1, obj2){
        return JSON.stringify(obj1) == JSON.stringify(obj2)
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
export default _