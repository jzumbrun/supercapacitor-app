import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Account from './controllers/account_controller.jsx'
import Signup from './controllers/signup_controller.jsx'
import Signin from './controllers/signin_controller.jsx'
import Forgot from './controllers/forgot_controller.jsx'
import Reset from './controllers/reset_controller.jsx'

export default () => {
    return (
        <Switch>
            <Route exact path="/users/account" component={Account} />
            <Route exact path="/users/signup" component={Signup} />
            <Route exact path="/users/signin" component={Signin} />
            <Route exact path="/users/forgot" component={Forgot} />
            <Route exact path="/users/reset/:_id/:reset_password" component={Reset} />
        </Switch>
    )
}