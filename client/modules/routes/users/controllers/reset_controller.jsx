import React from 'react'
import { Component } from 'supercapacitor'
import UserStore from 'modules/routes/users/stores/user_store'
import FormLib from 'modules/lib/form'

class Reset extends Component {

    constructor(props){

        super(props)

        this.state = {
            form: {
                _id: props.match.params._id,
                reset_password: props.match.params.reset_password,
                password: ''
            }
        }

    }

    /**
    * Handle Sign Up
    */
    handleSubmit(e){
        e.preventDefault()
        UserStore.reset(this.state.form)
    }
    
    render() {

        return (
            <div className="col-md-8 col-md-offset-2">
                <form>
                    <div className="panel panel-default margin-top-xlg">
          
                        <div className="panel-heading">
                            Reset Password
                        </div>
                        <div className="panel-body">
                            <div className="form-group">
                                <label htmlFor="password">New Password</label>
                                <input type="password" className="form-control" onChange={FormLib.handleChange.bind(this,'password')}/>
                            </div>

                            <button onClick={this.handleSubmit.bind(this)} className="btn btn-primary">GO</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default Reset