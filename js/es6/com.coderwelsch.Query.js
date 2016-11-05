export default class $ {
	constructor ( selector ) {
		if ( selector === null || !selector ) {
			window.console.error( "Zero-length selectors aren't permitted" );
			return false;
		} else if ( typeof selector === "string" ) {
			this[ 0 ] = window.document.querySelectorAll( selector );
		} else if ( selector instanceof HTMLElement || typeof selector === "object" && selector.length ) {
			this[ 0 ] = selector;
		} else {
			window.console.error( "Unsupported selector/element %s", selector );
			return false;
		}

		return this;
	}

	hasClass ( className ) {
		if ( this[ 0 ].length > 1 ) {
			window.console.error( "hasClass() won't work with multiple elements (elements: %s)", this[ 0 ].length );
		}

		if ( this[ 0 ].classList ) {
			return this[ 0 ].classList.contains( className );
		} else {
			return ( new RegExp( "(^| )" + className + "( |$)", "gi" ).test( this[ 0 ].className ) );
		}
	}

	addClass ( className ) {
		let classNames = className.split( " " ),
			addClass = function ( element ) {
				if ( element.classList ) {
					element.classList.add( className );
				} else {
					element.className += " " + className;
				}
			};

		if ( classNames.length > 1 ) {
			for ( let tmpClassName of classNames ) {
				this.addClass( tmpClassName );
			}
		} else {
			if ( this[ 0 ].length > 1 ) {
				for ( let element of this[ 0 ] ) {
					addClass( element );
				}
			} else {
				addClass( this[ 0 ] );
			}
		}

		return this;
	}

	removeClass ( className ) {
		let classNames = className.split( " " ),
			removeClass = function ( element ) {
				if ( element.classList ) {
					element.classList.remove( className );
				} else {
					element.className = element.className.replace( className, "" ).trim();
				}
			};

		if ( classNames.length > 1 ) {
			for ( let tmpClassName of classNames ) {
				this.removeClass( tmpClassName );
			}
		} else {
			if ( this[ 0 ].length > 1 ) {
				for ( let element of this[ 0 ] ) {
					removeClass( element );
				}
			} else {
				removeClass( this[ 0 ] );
			}
		}

		return this;
	}

	before ( element ) {
		let targetElements = this[ 0 ].length > 1 ? this[ 0 ] : this;

		for ( tmpElement in targetElements ) {
			tmpElement.insertAdjacentHTML( "beforebegin", element );
		}

		return this;
	}

	after ( element ) {
		let targetElements = this[ 0 ].length > 1 ? this[ 0 ] : this;

		for ( tmpElement in targetElements ) {
			tmpElement.insertAdjacentHTML( "afterend", element );
		}

		return this;
	}

	append ( element ) {
		let targetElements = this[ 0 ].length > 1 ? this[ 0 ] : this;

		for ( tmpElement in targetElements ) {
			tmpElement.appendChild( element );
		}
	}

	children () {
		if ( this[ 0 ].length !== 1 ) {
			window.console.error( "children() works only on a single element" );
		}
	}

	// accessible without instanciation
	static getJSON ( url, success, error ) {
		if ( typeof success !== "function" ) {
			window.console.error( "getJSON() You have to define a success callback" );
			return false;
		}

		this.ajax( {
			url: url,
			success: success,
			error: error
		} );
	}

	static ajax ( settings ) {
		let request = new XMLHttpRequest();

		settings = Object.assign( {
			url: "",
			type: "GET",
			data: undefined,
			success: ( data ) => {},
			error: ( error ) => {}
		}, settings );

		request.open( settings.type, settings.url, true );
		request.onload = function () {
			if (request.status >= 200 && request.status < 400) {
				settings.success( data );
			} else {
				settings.error( error, request );
			}
		};

		request.onerror = failed;
		request.send();
	}
}