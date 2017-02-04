let BrowserSupport = {
	classList: undefined
};

export default class $ {
	constructor ( selector = null ) {
		let elem = [];

		if ( typeof selector === "string" ) {
			elem = document.querySelectorAll( selector );
		} else if ( selector instanceof window.HTMLElement ) {
			elem =  [ selector ];
		} else if ( selector instanceof $ ) {
			elem = selector.elements;
		}

		this.elements = elem;
	}

	hasClass ( className = "" ) {
		if ( !this.elements.length ) {
			return this;
		} else if ( className.indexOf( " " ) === -1 ) {
			if ( BrowserSupport.classList === true ) {
				return this.elements[ 0 ].classList.contains( className );
			} else {
				return ( new RegExp( "(^| )" + className + "( |$)", "gi" ).test( this.elements[ 0 ].className ) );
			}
		}

		return false;
	}

	first () {
		// if there is at least one element
		if ( this.elements.length > 1 ) {
			return new $( this.elements[ 0 ] );
		}

		// if there is no element return this
		return this;
	}

	addClass ( classList = "" ) {
		// do nothing when classList is empty
		if ( !classList || !this.elements.length ) {
			return this;
		}

		// split the new class names and convert to array
		classList = this.splitClassNames( classList );

		// set classList browser support
		BrowserSupport.classList = "classList" in this.elements[ 0 ];

		// native class list add
		if ( BrowserSupport.classList === true ) {
			this.each( ( elem ) => {
				for ( let _class of classList ) {
					elem.classList.add( _class );
				}
			} );
		} else {
			let elemSplittedClasses,
				currElemClass;

			this.each( ( elem ) => {
				currElemClass = elem.className;
				elemSplittedClasses = this.splitClassNames( currElemClass );

				for ( let newClass of classList ) {
					if ( elemSplittedClasses.indexOf( newClass ) !== -1 ) {
						continue;
					}

					elem.className += " " + newClass;
				}
			} );
		}

		return this;
	}

	removeClass ( classList = "" ) {
		// do nothing when classList is empty
		if ( !classList || !this.elements.length ) {
			return this;
		}

		// set classList browser support
		BrowserSupport.classList = "classList" in this.elements[ 0 ];

		// split the new class names and convert to array
		classList = this.splitClassNames( classList );

		// native class list add
		if ( BrowserSupport.classList === true ) {
			this.each( ( elem ) => {
				for ( let _class of classList ) {
					elem.classList.remove( _class );
				}
			} );
		} else {
			let elemSplittedClasses,
				currElemClass;

			this.each( ( elem ) => {
				currElemClass = elem.className;
				elemSplittedClasses = this.splitClassNames( currElemClass );

				for ( let newClass of classList ) {
					elem.className = currElemClass.replace( new RegExp( "(^|\\b)" + newClass.split( " " ).join( "|" ) + "(\\b|$)", "gi"), " " );
				}
			} );
		}

		return this;
	}

	attr ( key, value ) {
		if ( !key || !this.elements.length ) {
			return null;
		}

		if ( value !== undefined ) {
			this.each( ( elem ) => {
				elem.setAttribute( key, value );
			} );

			return this;
		} else {
			return this.elements[ 0 ].getAttribute( key );
		}
	}

	data ( key, value ) {
		if ( !key || !this.elements.length ) {
			return null;
		}

		key = key.indexOf( "data-" ) === 0 ? key : "data-" + key;

		return this.attr( key, value );
	}

	html ( html ) {
		// get html
		if ( html instanceof window.HTMLElement ) {
			html = html.outerHTML;
		} else if ( html instanceof $ ) {
			html = html.html();
		} else if ( html === undefined && this.elements.length ) {
			return this.elements[ 0 ].innerHTML;
		} else if ( html === true ) {
			return this.elements[ 0 ].outerHTML;
		}

		// set html
		this.each( ( elem ) => {
			elem.innerHTML = html;
		} );

		return this;
	}

	empty () {
		this.each( ( elem ) => {
			elem.innerHTML = "";
		} );

		return this;
	}

	each ( callback, returnInstances = false ) {
		for ( let elem of this.elements ) {
			if ( returnInstances ) {
				callback( new $( elem ) );
			} else {
				callback( elem );
			}
		}

		return this;
	}

	splitClassNames ( classes ) {
		return classes.split( " " );
	}
}
