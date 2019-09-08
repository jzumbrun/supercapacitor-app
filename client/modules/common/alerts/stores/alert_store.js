import { Store } from 'supercapacitor'
import _ from 'underscore'


class AlertStore extends Store {
    constructor(){
        super('alerts.stores.alert')

        this.alerts = []

        window.onhashchange = this.onHashChange.bind(this)
    }

    /**
     * On Hash Change
     */
    onHashChange(){
        // Any persisted alerts need to go now.
        _.each(this.alerts, (alert) => {
            if(!alert.timeout){
                alert.timeout = 4000
            }
        })
        this.clear()
    }

    /**
     * Add
     */
    add(alerts){
        // Force argument to be an array
        if(!_.isArray(alerts)){
            alerts = [alerts]
        }
        _.each(alerts, (alert) => {
            alert.type = alert.type || 'info'

            // Check for duplicates unless duplicates are allowed
            _.each(this.alerts, (this_alert) => {
                if(!alert.duplicates && this_alert.message == alert.message){
                    this.delete(alert.message)
                }
            })

            this.alerts.push(alert)
        })

        setTimeout(() => {
            this.emit('add.success', this.alerts)
        }, 500)

    }

    /**
     * Delete
     */
    delete(message){

        if(_.isFinite(message)){
            message = message.toString()
        }

        if(_.isString(message)){
            this.alerts = this.alerts.filter((a) => { return a.message != message })
        }
        else if(_.isObject(message) && message.tag){
            this.alerts = this.alerts.filter((a) => { return a.tag != message.tag })
        }
        this.emit('delete.success', this.alerts)
    }

    /**
     * Clear
     */
    clear(){
        _.each(this.alerts, (alert) => {
            // Do not delete alerts already marked as cleared
            // Do not delete alerts without a timeout. On hash change will set no timeouts
            if(alert.cleared || !alert.timeout){
                return;
            }

            // Mark the alert as cleared so it wont get sent to clear again
            alert.cleared = true

            // Delete the alert after a time
            setTimeout(() => {
                this.delete(alert.message)
            }, alert.timeout)
        })
    }

}

export default new AlertStore()
