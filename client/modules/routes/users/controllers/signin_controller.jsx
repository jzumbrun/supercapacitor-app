import React from 'react'
import _ from 'underscore'
import { Component } from 'supercapacitor'
import Loading from 'modules/layouts/components/loading.jsx'
import UserStore from 'modules/routes/users/stores/user_store'
import FormLib from 'modules/lib/form'

class SignIn extends Component {

    constructor(props){

        super(props)

        this.state = {
            form: {
                email: '',
                password: ''
            }
        }

        // Force signed in user to contests list
        if (UserStore.current._id) {
            _.route('home/index')
        }

    }

    /**
    * Handle Sign Up
    */
    handleSubmit(e){
        e.preventDefault()
        UserStore.signIn(this.state.form)
    }
    
    render() {
        // Do not render if token
        if(this.props.match.params && this.props.match.params.token){ return(<Loading/>) }

        return (
            <div className="col-md-8 col-md-offset-2">
                <form>

                    <div className="panel panel-default margin-top-xlg">

                        <div className="panel-heading">
                            Sign In
                        </div>
                        <div className="panel-body">
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input type="text" className="form-control" onBlur={FormLib.handleChange.bind(this,'email')} onChange={FormLib.handleChange.bind(this,'email')}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" className="form-control" onBlur={FormLib.handleChange.bind(this,'password')} onChange={FormLib.handleChange.bind(this,'password')}/>
                            </div>

                            <button onClick={this.handleSubmit.bind(this)} className="btn btn-primary">Sign In</button> <a className="margin-left-sm" href="/#/users/forgot" > Forgot Password?</a>
                        </div>
                    </div>
                    <div className="text-center"><a href="/#/users/signup">Need an Account? Sign Up</a></div>

                </form>
            </div>
        )
    }
}

export default SignIn
