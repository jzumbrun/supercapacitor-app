import React from 'react'
import { Link } from 'react-router-dom'
import _ from 'underscore'

export default class Dropdown extends React.Component {
    constructor(props) {
        super(props)
        this.id = _.uuid()
        this.state = {
            show: false
        }
    }

    handleClick () {
        this.setState({show: !this.state.show})
    }

    handleClose (e) {

        // Handle close is not controlled by its own click
        if(e.target.id == this.id) return

        if(this.state.show){
            this.setState({show: false}, () => {
                if(_.isFunction(this.props.onClose)){
                    this.props.onClose()
                }
            })
        }
    }

    render() {

        return (
            <div id={this.props.id} className={this.props.className ? ('dropdown ' + this.props.className) : 'dropdown'}>
                <div>
                    <a href='javascript:void(0)' id={this.id} className={this.props.trigger.className || 'dropdown-toggle'} onClick={this.handleClick.bind(this)}>{this.props.trigger.label} {this.props.caret && <span className="caret"></span>}</a>
                    {this.state.show &&
                        <ul className="dropdown-menu" onClick={this.handleClick.bind(this)}>
                            {this.props.links.map((link, i) => {
                                if(link.text) {
                                    return <li key={i} className="text">{link.text}</li>
                                }
                                else if (link.divider) {
                                    return <li key={i} role="separator" className="divider"></li>
                                }
                                else if (link.handleClick) {
                                    return <li key={i}><a href="javascript:void(0)" className="link" onClick={link.handleClick}>{link.label}</a></li>
                                }
                                return <li key={i}><Link to={link.to}>{link.label}</Link></li>
                            })}
                        </ul>
                    }
                </div>

            </div>
        )
    }
}