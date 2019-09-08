import React from 'react'
import _ from 'underscore'
import classNames from 'classnames'

export default class Select extends React.Component {

    constructor(props) {
        super(props)
        this.props = props
        this.state = {
            selected: [],
            open: false
        }
    }

    getSelected(props) {
        var selected = []
        props.selected.forEach((value) => {
            props.options.forEach((group) => {
                group.options.forEach((option) => {
                    if(option.value == value){
                        selected.push({label: option.label, value: option.value})
                    }
                })
            })
        })

        return selected
    }

    handleChange(item) {
        var selected = this.getSelected(this.props)
        if(!!_.findWhere(selected, {value: item.value})){
            selected = selected.filter(a => {return a.value != item.value} )
        }
        else selected.push({value: item.value, label: item.label})

        this.setState({
            open: false
        })

        var values = []
        selected.forEach((s) => {
            values.push(s.value)
        })

        this.props.onChange(values)
    }
    toggleMenu() {
        this.setState({
            open: !this.state.open
        })
    }
    render() {
        var selected = this.getSelected(this.props)

        return (
            <div ref="selectWrapper" className={classNames('select-wrapper',{
                    open: this.state.open
                })}>
                <div className="select-value" onClick={this.toggleMenu.bind(this)}>
                    {selected.map(s => {
                    return (
                        <span key={s.value}>
                            <label 
                                htmlFor={s.value}
                                onClick={this.handleChange.bind(this, s)}>
                                {s.label}
                            </label>
                        </span>
                    )})}
                </div>
                {this.props.options && this.state.open &&
                 <div className="checkbox-wrapper" onClick={this.toggleMenu.bind(this)}>
                    {this.props.options.map( group => {
                        return (
                            <div key={group.group}>
                                <label className="group">{group.group}</label>
                                {group.options.map( item => {
                                    return (
                                        <div className="col-lg-12" key={item.value}>
                                            <div className="row">
                                                <input
                                                    onChange={this.handleChange.bind(this, item)}
                                                    type="checkbox" 
                                                    checked={!!_.findWhere(selected, {value: item.value})}
                                                    /> <label className="item-label">{item.label}&nbsp;</label>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                         )
                    })}
                </div>
                }
            </div>
        )
    }
}

