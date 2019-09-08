import React from 'react'

export default class Modals extends React.Component {
    render() {
        return (
            <div id="modals">
                {this.props.modals && this.props.modals.map((modal, key) => new React.cloneElement(modal, { key: key}))}
            </div>
        )
    }
}