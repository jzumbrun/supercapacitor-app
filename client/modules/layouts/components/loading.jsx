import React from 'react'
import PropTypes from 'prop-types'


class Loading extends React.Component {
    
    constructor(props){
        super(props)
    }
    
    render() {
        return (
            <div className="text-center" >
                <svg width={this.props.size + 'px'} height={this.props.size + 'px'} xmlns="http://www.w3.org/2000/svg" viewBox={'0 0 ' + this.props.size + ' ' + this.props.size} preserveAspectRatio="xMidYMid" class="uil-ripple">
                    <rect x="0" y="0" width={this.props.size} height={this.props.size} fill="none" class="bk"></rect>
                    <g> 
                        <animate attributeName="opacity" dur="2s" repeatCount="indefinite" begin="0s" keyTimes="0;0.33;1" values="1;1;0">
                        </animate>
                        <circle cx="50" cy="50" r="40" stroke="#5cffd6" fill="none" strokeWidth="8" strokeLinecap="round">
                            <animate attributeName="r" dur="2s" repeatCount="indefinite" begin="0s" keyTimes="0;0.33;1" values="0;22;44"></animate>
                        </circle>
                    </g>
                    <g>
                        <animate attributeName="opacity" dur="2s" repeatCount="indefinite" begin="1s" keyTimes="0;0.33;1" values="1;1;0"></animate>
                        <circle cx="50" cy="50" r="40" stroke="#75bf41" fill="none" strokeWidth="8" strokeLinecap="round">
                            <animate attributeName="r" dur="2s" repeatCount="indefinite" begin="1s" keyTimes="0;0.33;1" values="0;22;44"></animate>
                        </circle>
                    </g>
                </svg>
            </div>
        )
    }
}

Loading.propTypes = {
    size: PropTypes.number
}

Loading.defaultProps = {
    size: 100
}

export default Loading