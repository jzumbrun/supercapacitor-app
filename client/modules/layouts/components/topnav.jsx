import React from 'react'
import _ from 'underscore'
import UserStore from 'modules/routes/users/stores/user_store'
import Dropdown from 'modules/common/dropdown/components/dropdown.jsx'

class TopNav extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            current : UserStore.current
        }

        UserStore.on('saveToken.success', this.handleCurrentChange.bind(this))
        UserStore.on('signOut', this.handleCurrentChange.bind(this))
        UserStore.on('update.success', this.handleCurrentChange.bind(this))
        UserStore.on('reset.success', this.handleCurrentChange.bind(this))

    }
    
    /**
     * Handle Current Change
     */
    handleCurrentChange(){
        this.setState({current: UserStore.current})

        if(UserStore.current._id){
            window.location = '#/home/index'
        }
        else{
            window.location = '#/'
        }
    }

    /**
     * Handle Sign Out
     */
    handleSignOut(e){
        UserStore.signOut()
    }

    render() {
        return (
            <nav className="navbar navbar-default navbar-static-top top-shade">
                <div className="container">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="#">
                            <img src="/assets/images/logo.svg" />
                        </a>
                    </div>
                    {!this.state.current._id &&
                        <div className="container">
                            <ul className="nav navbar-nav">
                                <li>
                                    <button className="btn btn-default" onClick={() => _.route('users/signin')}>Sign In</button>
                                    <button className="btn btn-primary margin-left-sm" onClick={() => _.route('users/signup')}>Sign Up</button>
                                </li>
                            </ul>
                        </div>
                    }
                    {this.state.current._id &&
                        <div className="container">
                            <ul className="nav navbar-nav main-menu">
                                <li>
                                    <Dropdown
                                        trigger={{label: this.state.current.first_name}}
                                        links={[
                                            {label: 'Home', to: '/home/index'},
                                            {label: 'Account', to: '/users/account'},
                                            {divider: true},
                                            {label: 'Sign Out', handleClick: this.handleSignOut.bind(this)}
                                        ]}
                                        caret={true}
                                    />
                                </li>
                            </ul>
                        </div>
                    }
                </div>
            </nav>
        )
    }
}

export default TopNav