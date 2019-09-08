var jsdom = require('mocha-jsdom'),
    React = require('react'),
    ReactDOM = require('react-dom'),
    TestUtils = require('react-addons-test-utils'),
    Signup = {}

require('should')

describe('Signup', function(){
    jsdom()
    
    before(function(){
        global.localStorage = {
            getItem: function(){},
            setItem: function(){}
        }
    })

    beforeEach(function(){
        Signup = require('../components/signup.jsx')
    })
    
    describe('form', function(){
        it('should have correct fields', function(){
            var $ = require('jquery')

            // Render a checkbox with label in the document
            var signup, input, signup_html

            signup = TestUtils.renderIntoDocument(<Signup />)
            signup_html = ReactDOM.findDOMNode(signup).outerHTML
            
            $(signup_html, window).find('input').should.have.length(4)

        })
        
    })

})