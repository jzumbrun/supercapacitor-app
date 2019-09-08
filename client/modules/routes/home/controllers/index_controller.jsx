import React from 'react'
import { Component } from 'supercapacitor'
import UserStore from 'modules/routes/users/stores/user_store'
import HomeStore from 'modules/routes/home/stores/home_store'

class Index extends Component {

    constructor(props){
        super(props)
        UserStore.is('user', true)
        this.state = {}

        this.connect(HomeStore, 'getMe.success')
    }

    componentDidMount() {
        super.componentDidMount()
        HomeStore.getMe()
    }

    onGetMeSuccess(data) {
        this.setState(data)
    }

    render() {
        var home_state = HomeStore.getState()
        return (
            <div className="container">
                <div className="page-header">
                    <h1>Welcome Home {home_state.first_name}</h1>
                </div>
            </div>
        )
    }
}

export default Index
