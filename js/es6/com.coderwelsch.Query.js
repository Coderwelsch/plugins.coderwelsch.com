import Utils from "./com.coderwelsch.Utils.js";


let BrowserSupport = {
	classList: undefined
};

let Measurements = {
	scrollbarWidth: undefined
};

export default class $ {
	constructor ( selector = null ) {
		let elem = [];

		if ( typeof selector === "string" && /<[a-z][\s\S]*>/gi.test( selector ) ) {
			let newElem = document.createElement( "div" );
			newElem.innerHTML = selector;

			elem = [].slice.call( newElem.children );
		} else if ( typeof selector === "string" ) {
			elem = document.querySelectorAll( selector );
		} else if ( selector instanceof window.HTMLElement || selector === window.document || selector === window ) {
			elem.push( selector );
		} else if ( selector instanceof Array || selector instanceof window.NodeList ) {
			elem = selector;
		} else if ( selector instanceof $ || selector !== null && selector.elements ) {
			elem = selector.elements;
		}

		this.elements = elem;

		return this;
	}

	hasClass ( className ) {
		if ( className && className.indexOf( " " ) === -1 && this.elements.length ) {
			if ( "classList" in this.elements[ 0 ] ) {
				return this.elements[ 0 ].classList.contains( className );
			} else {
				return ( new RegExp( "(^| )" + className + "( |$)", "gi" ).test( this.elements[ 0 ].className ) );
			}
		}

		return false;
	}

	toggleClass ( className ) {
		if ( this.elements.length ) {
			this.each( ( $elem ) => {
				if ( $elem.hasClass( className ) ) {
					$elem.removeClass( className );
				} else {
					$elem.addClass( className );
				}
			}, true );
		}

		return this;
	}

	offset () {
		if ( this.elements.length ) {
			let elem = this.get( 0 ),
				rectangle = elem.getBoundingClientRect(),
				body = document.body;

			return {
				top: rectangle.top + body.scrollTop,
				left: rectangle.left + body.scrollLeft
			};
		}

		return this;
	}

	appendTo ( elem ) {
		if ( !this.elements.length ) {
			return this;
		}

		if ( elem instanceof $ ) {
			elem.append( this );
		} else {
			new $( elem ).append( this );
		}

		return this;
	}

	append ( elem ) {
		if ( !this.elements.length ) {
			return this;
		}

		// create new query object by selector/html string
		if ( typeof elem === "string" ) {
			elem = new $( elem );
		}

		if ( elem instanceof $ && elem.elements.length ) {
			// reassign the object of elem.elements[ 0 ] back
			// otherwise the elem.elements[ 0 ] object will be removed / undefined
			elem.elements[ 0 ] = this.elements[ 0 ].appendChild( elem.elements[ 0 ] );
		} else if ( elem instanceof window.HTMLElement ) {
			// reassign the object of elem back to itself
			// otherwise the elem object will be removed / undefined
			elem = this.elements[ 0 ].appendChild( elem );
		}

		return this;
	}

	first () {
		// if there is at least one element
		if ( this.elements.length > 1 ) {
			return new $( this.elements[ 0 ] );
		}

		// if there is no element return this
		return this;
	}

	parent () {
		if ( !this.elements.length ) {
			return new $();
		}

		return new $( this.get( 0 ).parentNode );
	}

	css ( styleProperty = "", value ) {
		if ( !this.elements.length ) {
			return this;
		}

		if ( typeof styleProperty === "string" && value === undefined ) {
			styleProperty = $.convertSnakeCaseToCamelCase( styleProperty );

			return window.getComputedStyle( this.elements[ 0 ] )[ styleProperty ];
		} else if ( typeof styleProperty === "string" && value !== undefined ) {
			styleProperty = $.convertSnakeCaseToCamelCase( styleProperty );
			this.elements[ 0 ].style[ styleProperty ] = value;
		} else if ( typeof styleProperty === "object" ) {
			let convertedKey;

			for ( let key in styleProperty ) {
				if ( styleProperty.hasOwnProperty( key ) ) {
					this.each( ( elem ) => {
						convertedKey = $.convertSnakeCaseToCamelCase( key );
						elem.style[ convertedKey ] = styleProperty[ convertedKey ];
					} );
				}
			}
		}

		return this;
	}

	find ( selector ) {
		if ( !this.elements.length ) {
			return new $();
		}

		let foundElems = [];

		this.each( ( item ) => {
			let childs = item.querySelectorAll( selector );

			if ( childs !== null ) {
				foundElems.push.apply( foundElems, childs );
			}
		} );

		return new $( foundElems );
	}

	next () {
		if ( !this.elements.length ) {
			return this;
		}

		let firstElem = this.get( 0 ),
			nextElem = firstElem.nextElementSibling;

		if ( nextElem !== null && nextElem !== firstElem ) { // if its another element
			return new $( nextElem );
		} else if ( nextElem === null || nextElem === firstElem ) {
			nextElem = firstElem.parentNode.firstElementChild;

			return new $( nextElem );
		} else {
			return this;
		}
	}

	prev () {
		if ( !this.elements.length ) {
			return this;
		}

		let firstElem = this.get( 0 ),
			prevElem = firstElem.previousElementSibling;

		if ( prevElem !== null && prevElem !== firstElem ) { // if its another element
			return new $( prevElem );
		} else if ( prevElem === null || prevElem === firstElem ) {
			prevElem = firstElem.parentNode.lastElementChild;

			return new $( prevElem );
		} else {
			return this;
		}
	}

	on ( eventName, customParams, eventHandler, isOneTime ) {
		if ( !this.elements.length ) {
			return this;
		}

		// if custom params set
		if ( !eventHandler ) {
			eventHandler = customParams;
		}

		this.each( ( elem ) => {
			function handler ( event ) {
				let clonedEvent = Utils.cloneEvent( event );

				if ( customParams !== undefined ) {
					clonedEvent.data = customParams;
				}

				clonedEvent.currentTarget = elem;
				eventHandler.call( this, clonedEvent );

				if ( isOneTime ) {
					event.currentTarget.removeEventListener( eventName, handler );
				}
			}

			elem.addEventListener( eventName, handler );
		} );

		return this;
	}

	one ( eventName, customParams, eventHandler ) {
		this.on( eventName, customParams, eventHandler, true );
	}

	trigger ( eventName ) {
		if ( !this.elements.length ) {
			return this;
		}

		let event = document.createEvent( "HTMLEvents" );
		event.initEvent( eventName, true, false );
		this.get( 0 ).dispatchEvent( event );
	}

	width () {
		if ( !this.elements.length ) {
			return 0;
		} else {
			return this.elements[ 0 ].offsetWidth;
		}
	}

	height () {
		if ( !this.elements.length ) {
			return 0;
		} else {
			return this.elements[ 0 ].offsetHeight;
		}
	}


	addClass ( classList = "" ) {
		// do nothing when classList is empty
		if ( !classList || !this.elements.length ) {
			return this;
		}

		// split the new class names and convert to array
		classList = $.splitClassNames( classList );

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
				elemSplittedClasses = $.splitClassNames( currElemClass );

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
		classList = $.splitClassNames( classList );

		// native class list add
		if ( BrowserSupport.classList === true ) {
			this.each( ( elem ) => {
				for ( let _class of classList ) {
					elem.classList.remove( _class );
				}
			} );
		} else {
			let currElemClass;

			this.each( ( elem ) => {
				currElemClass = elem.className;

				for ( let newClass of classList ) {
					elem.className = currElemClass.replace( new RegExp( "(^|\\b)" + newClass.split( " " ).join( "|" ) + "(\\b|$)", "gi" ), " " );
				}
			} );
		}

		return this;
	}

	attr ( key, value ) {
		if ( !key || !this.elements.length ) {
			return null;
		}

		if ( value !== undefined && value !== null ) {
			this.each( ( elem ) => {
				elem.setAttribute( key, value );
			} );

			return this;
		} else if ( value === null ) {
			// remove attribute on value = null
			this.each( ( elem ) => {
				elem.removeAttribute( key );
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

	text ( text ) {
		// get html
		if ( text === undefined ) {
			if ( !this.elements.length ) {
				return "";
			} else {
				return this.elements[ 0 ].textContent;
			}
		}

		// set text
		this.each( ( elem ) => {
			elem.textContent = text;
		} );

		return this;
	}

	html ( html ) {
		// get html
		if ( html === undefined ) {
			if ( !this.elements.length ) {
				return "";
			} else {
				return this.elements[ 0 ].innerHTML;
			}
		} else if ( html === true ) { // return outer html
			return this.elements[ 0 ].outerHTML;
		}

		// set html
		this.each( ( elem ) => {
			elem.innerHTML = html;
		} );

		return this;
	}

	val ( value ) {
		if ( !this.elements.length ) {
			return null;
		}

		if ( value !== undefined ) {
			this.elements[ 0 ].value = value;
		} else {
			return this.elements[ 0 ].value;
		}

		return this;
	}

	empty () {
		this.each( ( elem ) => {
			elem.innerHTML = "";
		} );

		return this;
	}

	get ( index = 0 ) {
		if ( !this.elements.length ) {
			return null;
		}

		return this.elements[ index ];
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

	closest ( selector ) {
		if ( !this.elements.length ) {
			return null;
		}

		let prefixedMatchesFns = [
				"matches",
				"webkitMatchesSelector",
				"mozMatchesSelector",
				"msMatchesSelector",
				"oMatchesSelector"
			],
			matchesFnName,
			parent;

		// find matches fn
		for ( let fn of prefixedMatchesFns ) {
			if ( typeof window.document.body[ fn ] === "function" ) {
				matchesFnName = fn;
				break;
			}
		}

		while ( this.elements[ 0 ] ) {
			parent = this.elements[ 0 ].parentElement;

			if ( parent && parent !== null && parent[ matchesFnName ]( selector ) ) {
				return new $( parent );
			}
		}

		return new $();
	}

	static measureScrollbarWidth () {
		let outer = document.createElement( "div" ),
			widthNoScroll,
			inner,
			widthWithScroll;

		if ( Measurements.scrollbarWidth !== undefined ) {
			return Measurements.scrollbarWidth;
		}

		// create outer div
		outer.style.visibility = "hidden";
		outer.style.width = "100px";
		outer.style.msOverflowStyle = "scrollbar";

		document.body.appendChild( outer );

		widthNoScroll = outer.offsetWidth;

		// force scrollbar
		outer.style.overflow = "scroll";

		// add inner div
		inner = document.createElement( "div" );
		inner.style.width = "100%";
		outer.appendChild( inner );

		widthWithScroll = inner.offsetWidth;

		// remove divs
		outer.parentNode.removeChild( outer );

		return widthNoScroll - widthWithScroll;
	}

	static ajax ( options ) {
		let request = new XMLHttpRequest(),
			formData;

		options = Utils.extend( true, {
			type: "GET",
			url: "",
			data: undefined,

			callbacks: {
				done: ( request ) => {},
				fail: ( request ) => { }
			}
		}, options );

		formData = ( () => {
			if ( !options.data ) {
				return;
			}

			let formData = new FormData();

			for ( let key in options.data ) {
				formData.append( key, options.data[ key ] );
			}

			return formData;
		} )();

		request.open( options.type, options.url, true );
		request.onload = () => { options.callbacks.done( request ); };
		request.onerror = () => { options.callbacks.done( request ); };
		request.send( formData );

		return this;
	}

	static disableScrolling ( $element = new $( "body" ) ) {
		if ( $element.elements.length === 0 ) {
			return $;
		}

		let paddingRight =  $element.css( "padding-right" ),
			overflow =  $element.css( "overflow" ),
			paddingRightFloat = Number.parseFloat( paddingRight ),
			sbWidth = $.measureScrollbarWidth();

		$element
			.css( {
				paddingRight: ( paddingRightFloat + sbWidth ) + "px",
				overflow: "hidden" } )
			.data( "query-old-padding-right", paddingRight )
			.data( "query-old-overflow", overflow );
	}

	static enableScrolling ( $element = new $( "body" ) ) {
		if ( $element.elements.length === 0 ) {
			return $;
		}

		let oldPaddingRight = $element.data( "query-old-padding-right" ),
			overflow = $element.data( "query-old-overflow" );

		$element.data( "query-old-padding-right", null );
		$element.data( "query-old-overflow", null );
		$element.css( {
			paddingRight: oldPaddingRight,
			overflow: overflow
		} );

		return $;
	}

	// thanks to: https://coderwall.com/p/iprsng/convert-snake-case-to-camelcase
	static convertSnakeCaseToCamelCase ( string ) {
		let find = /(\-\w)/g,
			convert = function ( matches ) {
				return matches[ 1 ].toUpperCase();
			};

		return string.replace( find, convert );
	}

	static splitClassNames ( classes ) {
		return classes.split( " " );
	}
}
