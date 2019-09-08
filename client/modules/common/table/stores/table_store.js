import { Store } from 'supercapacitor'
import _ from 'underscore'

class TableStore extends Store {

	constructor(){
		super('common.table.stores.table')
	}

	getData(id, endpoint, options) {

		// Get data from JavaScript 
		// (Pagination and sorting NOT implemented for JavaScript injected data)
		if(_.isObject(endpoint)){
			this.emit('getData.success.' + id, endpoint)
		}
		// Get data from server
		else{
			this.get(endpoint, options)
			.then((res) => {
				this.emit('getData.success.' + id, res.data)
			})
			.catch(this.emitRequestError.bind(this))
		}
	}

	refresh(id){
		this.emit('refresh.' + id)
	}

}

export default new TableStore()
