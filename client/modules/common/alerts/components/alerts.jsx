import React from 'react'
import _ from 'underscore'
import AlertStore from '../stores/alert_store.js'

class Alerts extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            alerts: []
        }

        AlertStore.on('add.success', (alerts) => {
            this.setState({alerts : alerts})
        })

        AlertStore.on('delete.success', (alerts) => {
            this.setState({alerts : alerts})
        })
    }

    /**
    * Handle Dismiss
    */
    handleDismiss(message) {
        AlertStore.delete(message)
    }
    
    render() {

        return (
            <div id="alerts">
                {this.state.alerts.map((alert, key) => {
                    return (
                        <div key={key} className={'alert alert-' + alert.type + ' alert-dismissible'} role="alert">
                            <button type="button" className="close" onClick={this.handleDismiss.bind(this, alert.message)} data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            {alert.title ? <h4>{alert.title}</h4> : ''}
                            {alert.message}
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default Alerts