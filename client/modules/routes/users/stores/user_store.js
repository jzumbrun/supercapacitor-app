import { Store } from 'supercapacitor'
import _ from 'underscore'

class UserStore extends Store {
    constructor(){
        super('users.stores.user')

        this.current = this.getCurrent()

    }

    /**
     * Get Subdomain
    */
    getSubdomain(hostname){
        return hostname.split('.')[0]
    }

    /**
     * Get Token
     */
    getCurrent(){
        var token = localStorage.getItem('token')
        try{
            if(token){
                return JSON.parse(_.base64Decode(token.split('.')[1]))
            }
            return {}
        } catch(err){
            localStorage.removeItem('token')
            console.log('Invalid token:', token)
        }
    }

    /**
     * Is
     */
    is(role, redirect){
        role = role || 'user'
        if(!this.current.roles || (_.isArray(this.current.roles) && this.current.roles.indexOf(role) === -1)){
            if(redirect){
                window.location = '#/users/signin'
            }
           return false
        }
        return true
    }

    /**
    * Update
    */
    update(options){

        this.put('/users', options)
        .then((res) => {
            localStorage.setItem('token', res.data.token)
            this.current = this.getCurrent()
            this.emit('update.success')
        })
        .catch(this.emitRequestError.bind(this))
    }

    /**
     * Save Token
     */
    saveToken(token){
        localStorage.setItem('token', token)
        this.current = this.getCurrent()
        this.emit('saveToken.success')
    }

    /**
     * Sign Up
     */
    signUp(options){
        this.post('/users/signup', options)
        .then((res) => {
            this.saveToken(res.data.token)
        })
        .catch(this.emitRequestError.bind(this))
    }

    /**
     * Sign Out
     */
    signOut(redirect){

        localStorage.removeItem('token')
        this.current = {}
        this.emit('signOut', redirect)
    }

    /**
     * Sign In
     */
    signIn(options){
        this.put('/users/signin', options)
        .then((res) => {
            this.saveToken(res.data.token)
        })
        .catch(this.emitRequestError.bind(this))
    }

    /**
     * Forgot
     */
    forgot(options){
        this.request('put', '/users/forgot', 'forgot.success', options)
    }

    /**
     * Reset
     */
    reset(options){

        this.put('/users/reset', options)
        .then((res) => {
            localStorage.setItem('token', res.data.token)
            this.current = this.getCurrent()
            this.emit('reset.success')
        })
        .catch(this.emitRequestError.bind(this))
    }

}

export default new UserStore()