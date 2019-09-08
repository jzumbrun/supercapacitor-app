import _ from 'underscore'
import React from 'react'
import ReactDom from 'react-dom'

class Sticky extends React.Component {
    
    constructor(props){
        super(props)

        this.state = {
            height: 0,
            sticky: false,
            initial_height: 0,
            sticky_style: {}
        }
    }
    
    componentDidMount() {
        this.onWindowScroll();
    }

    onWindowScroll() {

        this.setState({ initial_height: ReactDom.findDOMNode(this).offsetTop })
        window.onscroll = () => {
            this.calculateDistance(window.scrollY, this.state.initial_height)
        }
    }

    render() {
        var style = { position: 'initial', top: 'initial' }
        if(this.state.sticky){
            style = _.extend({ position: 'fixed', top: 0, left: 0, zIndex: 1000, width: '100%' }, this.props.stickyStyle)
        }
        return(
            <div style={style} 
                className={this.state.sticky ? 'sticky active' : 'sticky'}>
                {this.props.children}
            </div>
        )
    }
    
    calculateDistance(scroll_distance, initial_height) {
        this.setState({ height: initial_height - scroll_distance })
        if (this.state.height <= 0) {
            this.setState({ sticky: true })
        } 
        else {
            this.setState({ sticky: false })
        }
    }
}

Sticky.propTypes = {
    children: React.PropTypes.element.isRequired
}

Sticky.defaultProps = {
    stickyStyle: {}
}

export default Sticky