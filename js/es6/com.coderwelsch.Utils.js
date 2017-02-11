export default class Utilities {
	// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
	static extend ( deepMerge, target, source ) {
		let extended = {},
			deep = false,
			i = 0,
			length = arguments.length;

		// Check if a deep merge
		if ( Object.prototype.toString.call( arguments[ 0 ] ) === "[object Boolean]" ) {
			deep = arguments[ 0 ];
			i++;
		}

		function merge ( obj ) {
			for ( let prop in obj ) {
				if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
					// If deep merge and property is an object, merge properties
					if ( deep && Object.prototype.toString.call( obj[ prop ] ) === "[object Object]" ) {
						extended[ prop ] = Utilities.extend( true, extended[ prop ], obj[ prop ] );
					} else {
						extended[ prop ] = obj[ prop ];
					}
				}
			}
		}

		for ( ; i < length; i++ ) {
			let obj = arguments[ i ];
			merge( obj );
		}

		return extended;
	}
}