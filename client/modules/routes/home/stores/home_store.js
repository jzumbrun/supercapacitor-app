import { Store } from 'supercapacitor'
import  UserStore from 'modules/routes/users/stores/user_store'


class HomeStore extends Store {
    constructor(){
        super('home.stores.home')
    }

    /**
    * GetMe
    */
    getMe(){

        this.request('get', `/home/${UserStore.current._id}/me`, 'getMe.success')

        // OR call this:
        this.get(`/home/${UserStore.current._id}/me`)
        .then((res) => {
            // Set server state to store state or pass it to the emit
            this.setState(res.data) /* option 1 */
            this.emit('getMe.success', res.data /* option 2 */)
        })
        .catch(this.emitRequestError.bind(this))
    }

}

export default new HomeStore()