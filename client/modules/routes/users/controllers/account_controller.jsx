import React from 'react'
import { Component } from 'supercapacitor'
import UserStore from 'modules/routes/users/stores/user_store'
import FormLib from 'modules/lib/form'

class Account extends Component {

    constructor(props){

        super(props)

        this.state = {
            form: {
                first_name: UserStore.current.first_name,
                last_name: UserStore.current.last_name,
                email: UserStore.current.email,
                password: UserStore.current.password
            }
        }
    }

    /**
    * Handle Sign Up
    */
    handleSubmit(e){
        e.preventDefault()
        UserStore.update(this.state.form)
    }
    
    render() {

        return (
            <div className="container">
                <div className="page-header" >
                    <h1>Account</h1>
                </div>
                <form className="margin-bottom-lg">

                    <legend>Name</legend>

                    <div className="row">
                        <div className="col-lg-6 margin-bottom-md">
                            <label htmlFor="first_name">First Name</label>
                            <input type="text" value={this.state.form.first_name} className="form-control" onChange={FormLib.handleChange.bind(this,'first_name')}/>
                        </div>
                        <div className="col-lg-6 margin-bottom-md">
                            <label htmlFor="last_name">Last Name</label>
                            <input type="text" value={this.state.form.last_name} className="form-control" onChange={FormLib.handleChange.bind(this,'last_name')}/>
                        </div>
                    </div>

                    <legend>Security</legend>

                    <div className="row">
                        <div className="col-lg-6 margin-bottom-md">
                            <label htmlFor="email">Email Address</label>
                            <input type="text" value={this.state.form.email} className="form-control" onChange={FormLib.handleChange.bind(this,'email')}/>
                        </div>
                        <div className="col-lg-6 margin-bottom-md">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" placeholder="Leave blank to keep current password" onChange={FormLib.handleChange.bind(this,'password')}/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12 margin-top-md">
                            <button type="submit" className="btn btn-primary" onClick={this.handleSubmit.bind(this)}>GO</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default Account