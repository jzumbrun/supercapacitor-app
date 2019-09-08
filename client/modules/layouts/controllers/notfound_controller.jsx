import React from 'react'

export default class NotFound extends React.Component {
    render(){

        return (
            <div className="">
                <h1 className="">
                    What!!?? Inconceivable.
                </h1>
                <h3>
                    Something wrong has happend. Sorry mate! Try the following:
                </h3>
                <p>
                    <button type="button" className="btn btn-primary" onClick={() => _.route('home/index')}>Go to Home Page</button>
                    <button type="button" className="btn btn-default margin-left-sm" onClick={() => _.route('help/contact')}>Get Help</button>
                </p>
            </div>
        )
    }
}