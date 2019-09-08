import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './controllers/index_controller.jsx'

export default () => {
    return (
        <Switch>
            <Route exact path="/home/index" component={Home} />
        </Switch>
    )
}