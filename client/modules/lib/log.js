import _ from 'underscore'

class Log {

	constructor(){
        this.log = true
        this.record = true
    }

	/**
	* Og
	*/
	og(options) {
		var log = {}
		if(_.isString(options)) log = {_: options}
		else log = options
		this.log && console.log(log)
		options.rec && this.rec(log)
	}

	/**
	* Rec
	*/
	rec(log) {
		// TODO send log to somewhere other than console
	}

}

export default new Log()