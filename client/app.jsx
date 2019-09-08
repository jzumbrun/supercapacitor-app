import 'modules/lib/mixins'
import _ from 'underscore'
import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route, Switch } from 'react-router-dom'
import Config from 'config'
import Alerts from 'modules/common/alerts/components/alerts.jsx'
import AlertStore from 'modules/common/alerts/stores/alert_store'
import Modals from 'modules/common/modals/components/modals.jsx'
import TopNav from 'modules/layouts/components/topnav.jsx'
import SignIn from 'modules/routes/users/controllers/signin_controller.jsx'
import NotFound from 'modules/layouts/controllers/notfound_controller.jsx'
import { Event } from 'supercapacitor'
import UserStore from 'modules/routes/users/stores/user_store'
import Users from 'modules/routes/users/routes.jsx'
import Home from 'modules/routes/home/routes.jsx'
import lang from 'modules/lib/lang'

class App extends React.Component {

    constructor(props){
        super(props)
        Config.setEnv()
    }

    componentDidMount(){
        this.registerGlobalEvents()
    }

    registerGlobalEvents(){
        this.registerGlobalErrors()
        UserStore.on('signout.success', () => _.route('users/signin'))
    }

    /**
     * Register Global Errors
     */
    registerGlobalErrors(){
        function showErrors(errors) {
            if(!_.isEmpty(errors)){
                _.each(errors, (error, name) => {
                    error.title = 'Error'
                    error.type = 'danger'
                    error.message = lang(error.message)
                    AlertStore.add(error)
                })
            }
        }

        // Set events that handle signout and global app errors, etc
        Event.on('store.request.error.signout', (errors) => {
            UserStore.signOut()
            if(!_.isEmpty(errors)) errors = [{type: 'danger', message: 'Your session ended. Please log back in.'}]
            showErrors(errors)
        })

        // Global error handling
        Event.on('store.request.error.landing', (errors) => {
            showErrors(errors)
            _.route('home/index')
        })

        Event.on('store.request.error.maintenance', () => _.route('/maintenance'))
        Event.on('store.request.error.notfound', () => _.route('notfound'))
        Event.on('store.request.error', (errors) => showErrors(errors))

    }

    render() {
        return (
            <div>
                <TopNav />
                <Alerts />
                <Modals />
                <div className="container">
                    <Switch>
                        <Route exact path="/" component={SignIn} />
                        <Route path="/users" component={Users} />
                        <Route path="/home" component={Home} />
                        <Route component={NotFound} />
                    </Switch>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<HashRouter><App /></HashRouter>, document.getElementById('app'))