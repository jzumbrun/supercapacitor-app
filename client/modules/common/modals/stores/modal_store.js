import { Store } from 'supercapacitor'


class ModalStore extends Store {

	constructor(){
		super('common.modals.stores.modal')
		// Allow for more recent modals
		// to show over recent ones, ie modal on modal
		this._zindex = 2000
	}

	getZIndex(){
		return this._zindex
	}

	show(name, options){
		this._zindex = this._zindex + 1
		this.emit(name + '.show', options)
	}

	hide(name, options){
		
		if(name){
			this._zindex = this._zindex - 1
			this.emit(name + '.hide', options)
		}
		else {
			this._zindex = 2000
			this.emit('hide')
		}
	}

}

export default new ModalStore()