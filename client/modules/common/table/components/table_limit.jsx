import React from 'react'
import { Component } from 'supercapacitor'

class TableLimit extends Component {

    render() {
        return (
            <select className="form-control" value={this.props.limit} onChange={this.props.onLimitChange.bind(this)} >
                {[10, 25, 50, 100, 250, 500].map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
        )
    }
}

TableLimit.defaultProps = {
    onLimitChange: () => {}
}

export default TableLimit
