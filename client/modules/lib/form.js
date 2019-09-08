class Form {

	/**
	* Handle Change
	* this is object's this
	*/
	static handleChange(field, e, callback) {
		// Fast shallow copy
		var form = Object.assign({}, this.state.form)
		if(e.target) {
			form[field] = e.target.value
			if(e.target.type == 'checkbox'){
				form[field] = e.target.checked
			}

		}
		else {
			form[field] = e
		}

		this.setState({form: form}, callback || (() => {}))
	}
}

export default Form