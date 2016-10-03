class WebStorage {
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
			this.getData( key );
		} else {
			this.setData( key, value );
		}
	}

	getData ( key ) {
		if ( key === undefined || this.storage[ key ] === undefined ) {
			window.console.error( "Couldn't get data for %s in storage", key );

			return null;
		}

		let val = this.storage[ key ].value;

		switch ( this.storage[ key ].type ) {
			case "string":
				return String( val );
			case "number":
				return Number( val );
			case "boolean":
				return Boolean( val );
			case "object":
				return JSON.parse( val );
			default:
				return val;
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

module.exports = WebStorage;
