export default class Utilities {
	static isArray ( array ) {
		if ( typeof Array.isArray === "function" ) {
			return Array.isArray( array );
		}

		return Object.prototype.toString.call( array ) === "[object Array]";
	}

	static isPlainObject ( obj ) {
		if ( !obj || Object.prototype.toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		let hasOwnConstructor = Object.prototype.hasOwnProperty.call( obj, "constructor" ),
			hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && Object.prototype.hasOwnProperty.call( obj.constructor.prototype, "isPrototypeOf" );

		if ( obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf ) {
			return false;
		}

		let key;
		for ( key in obj ) { /**/ }

		return typeof key === "undefined" || Object.prototype.hasOwnProperty.call( obj, key );
	}

	static extend ( deepMerge, target, source1, source2, sourceN ) {
		let options,
			name,
			src,
			copy,
			copyIsArray,
			clone,
			i = 1,
			length = arguments.length,
			deep = false;

		target = arguments[0];

		if ( typeof target === "boolean" ) {
			deep = target;
			target = arguments[1] || {};
			i = 2;
		} else if ( ( typeof target !== "object" && typeof target !== "function" ) || target == null ) {
			target = {};
		}

		for ( ; i < length; ++i ) {
			options = arguments[i];

			if ( options != null ) {
				for ( name in options ) {
					src = target[name];
					copy = options[name];

					if ( target !== copy ) {
						// Recurse if we're merging plain objects or arrays
						if ( deep && copy && ( Utilities.isPlainObject( copy ) || ( copyIsArray = Utilities.isArray( copy ) ) ) ) {
							if ( copyIsArray ) {
								copyIsArray = false;
								clone = src && Utilities.isArray( src ) ? src : [];
							} else {
								clone = src && Utilities.isPlainObject( src ) ? src : {};
							}

							// Never move original objects, clone them
							target[name] = Utilities.extend( deep, clone, copy );

						// Don't bring in undefined values
						} else if ( typeof copy !== "undefined" ) {
							target[name] = copy;
						}
					}
				}
			}
		}

		// Return the modified object
		return target;
	}

	// https://css-tricks.com/snippets/javascript/get-url-variables/
	static parseUrlParameters ( string = window.location.search.substring( 1 ) ) {
		let vars = string.split( "&" ),
			paramObj = {};

		for (let i = 0; i < vars.length; i++ ) {
			let pair = vars[ i ].split( "=" );

			paramObj[ pair[ 0 ] ] = pair[ 1 ];
		}
		
		return paramObj;
	}

	static cloneEvent ( event ) {
		if ( event === undefined || event === null ) {
			return undefined;
		}

		let ClonedEvent = function () {},
			clone = new ClonedEvent();

		for ( let p in event ) {
			let d = Object.getOwnPropertyDescriptor( event, p );
			if ( d && ( d.get || d.set ) ) Object.defineProperty( clone, p, d ); else clone[ p ] = event[ p ];
		}

		Object.setPrototypeOf( clone, event );

		return clone;
	}

	static truncateString ( string = "", length = string.length ) {
		if ( string.length <= length ) {
			return string;
		}

		return string.substring( 0, length - 1 ) + "…";
	}
}
