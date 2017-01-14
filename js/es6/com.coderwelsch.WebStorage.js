export default class WebStorage {
	constructor ( type = "local", storagePrefix = "" ) {
		this.type = type === "local" ? type : "session";
		this.storagePrefix = storagePrefix;

		if ( type === "local" ) {
			this.storage = window.localStorage;
		} else {
			this.storage = window.sessionStorage;
		}
	}

	isSupported ( type = this.storage ) {
		return type !== undefined;
	}

	data ( key, value ) {
		if ( value === undefined ) {
			return this.getData( key );
		} else {
			this.setData( key, value );
		}
	}

	getData ( key ) {
		if ( key === undefined ) {
			window.console.error( "WebStorage key is not defined: %s", key );
			return null;
		} else if ( this.storage[ key ] === undefined ) {
			return null;
		}

		let data = JSON.parse( this.storage[ key ] );

		switch ( data.type ) {
			case "string":
				return String( data.value );
			case "number":
				return Number( data.value );
			case "boolean":
				return Boolean( data.value );
			case "object":
				return JSON.parse( data.valueal );
			default:
				return data.value;
		}
	}

	setData ( key, value ) {
		let data = {
			value,
			type: typeof value
		};

		this.storage[ key ] = JSON.stringify( data );
	}

	clear ( prefix = this.storagePrefix ) {
		if ( prefix ) {
			for ( let key in this.storage ) {
				if ( key.indexOf( prefix ) ) {
					delete this.storage[ key ];
				}
			}
		} else {
			this.storage.clear();
		}
	}
}
