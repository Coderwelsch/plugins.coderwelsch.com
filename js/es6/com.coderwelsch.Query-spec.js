// imports
import $ from "./com.coderwelsch.Query.js";

// tests
describe( "com.coderwelsch.Query.js", () => {
	describe( "constructor()", () => {
		beforeEach( () => {
			document.body.insertAdjacentHTML( "afterbegin", `
				<div class="test"></div>
			` );
		} );

		afterEach( () => {
			document.body.removeChild( document.querySelector( ".test" ) );
		} );

		it( "should create an instance", () => {
			let $elem = new $();

			expect( $elem instanceof $ ).toBe( true );
		} );

		it( "should create an instance by a dom selector", () => {
			let $elem = new $( ".test" );

			expect( $elem.elements.length ).toBe( 1 );
		} );

		it( "should create an instance by a dom element", () => {
			let $elem = new $( document.querySelector( ".test" ) );

			expect( $elem.elements.length ).toBe( 1 );
		} );

		it( "should create an instance by another Query instance", () => {
			let $elem1 = new $( document.querySelector( ".test" ) ),
				$elem2 = new $( $elem1 );

			expect( $elem2.elements[ 0 ] ).toBe( document.querySelector( ".test" ) );
		} );

		it( "should create an instance with empty elements", () => {
			let $elem = new $( ".not-matching-selector" );

			expect( $elem.elements.length ).toBe( 0 );
		} );
	} );

	describe( "hasClass()", () => {
		let $elem,
			$multiElems;

		beforeEach( () => {
			document.body.insertAdjacentHTML( "afterbegin", `
				<div class="test"></div>
				<div class="object"></div>
				<div class="hello"></div>
			` );

			$elem = new $( ".test" );
			$multiElems = new $( ".test, .object, .hello" );
		} );

		afterEach( () => {
			document.body.removeChild( document.querySelector( ".test" ) );
		} );

		describe( "[SINGLE ELEMENT TESTING]", () => {
			it( "should return false by an empty class", () => {
				expect( $elem.hasClass( "" ) ).toBe( false );
			} );

			it( "should has class 'test'", () => {
				expect( $elem.hasClass( "test" ) ).toBe( true );
			} );

			it( "should not has class 'fourty-two'", () => {
				expect( $elem.hasClass( "fourty-two" ) ).toBe( false );
			} );
		} );

		describe( "[MULTIPLE ELEMENTS TESTING]", () => {
			it( "should return false nothing by an empty classname for every element", () => {
				expect( $multiElems.hasClass( "" ) ).toBe( false );
				expect( $multiElems.hasClass( "" ) ).toBe( false );
				expect( $multiElems.hasClass( "" ) ).toBe( false );
			} );

			it( "first element should has class 'test'", () => {
				expect( $multiElems.hasClass( "test" ) ).toBe( true );
			} );

			it( "first element should not has class 'fourty-two'", () => {
				expect( $elem.hasClass( "fourty-two" ) ).toBe( false );
			} );
		} );
	} );

	describe( "addClass()", () => {
		let $elem,
			$multiElems;

		beforeEach( () => {
			document.body.insertAdjacentHTML( "afterbegin", `
				<div class="test"></div>
				<div class="object"></div>
				<div class="hello"></div>
			` );

			$elem = new $( ".test" );
			$multiElems = new $( ".test, .object, .hello" );
		} );

		afterEach( () => {
			document.body.removeChild( document.querySelector( ".test" ) );
		} );

		describe( "[SINGLE ELEMENT TESTING]", () => {
			it( "should do nothing by an empty classname", () => {
				$elem.addClass( "" );
				expect( $elem.elements[ 0 ].className ).toBe( "test" );
			} );

			it( "should add a classname to a dom element", () => {
				$elem.addClass( "another-test" );
				expect( $elem.elements[ 0 ].className ).toBe( "test another-test" );
			} );

			it( "should add multiple classnames-string to a dom element", () => {
				$elem.addClass( "test1 test2 test3" );
				expect( $elem.elements[ 0 ].className ).toBe( "test test1 test2 test3" );
			} );
		} );

		describe( "[MULTIPLE ELEMENTS TESTING]", () => {
			it( "should do nothing by an empty classname for every element", () => {
				$multiElems.addClass( "" );

				expect( $multiElems.elements[ 0 ].className ).toBe( "test" );
				expect( $multiElems.elements[ 1 ].className ).toBe( "object" );
				expect( $multiElems.elements[ 2 ].className ).toBe( "hello" );
			} );

			it( "should add a classname to some dom elements", () => {
				let className = "element";

				$multiElems.addClass( className );

				expect( $multiElems.elements[ 0 ].className ).toBe( "test " + className );
				expect( $multiElems.elements[ 1 ].className ).toBe( "object " + className );
				expect( $multiElems.elements[ 2 ].className ).toBe( "hello " + className );
			} );

			it( "should add multiple classnames-string to some dom elements", () => {
				let classNames = "element button disabled";

				$multiElems.addClass( classNames );

				expect( $multiElems.elements[ 0 ].className ).toBe( "test " + classNames );
				expect( $multiElems.elements[ 1 ].className ).toBe( "object " + classNames );
				expect( $multiElems.elements[ 2 ].className ).toBe( "hello " + classNames );
			} );
		} );
	} );

	describe( "removeClass()", () => {
		let $elem,
			$multiElems;

		beforeEach( () => {
			document.body.insertAdjacentHTML( "afterbegin", `
				<div class="test another-test disabled"></div>
				<div class="object another-test disabled"></div>
				<div class="hello another-test disabled"></div>
			` );

			$elem = new $( ".test" );
			$multiElems = new $( ".test, .object, .hello" );
		} );

		afterEach( () => {
			document.body.removeChild( document.querySelector( ".test" ) );
		} );

		describe( "[SINGLE ELEMENT TESTING]", () => {
			it( "should do nothing by an empty classname", () => {
				$elem.removeClass( "" );
				expect( $elem.elements[ 0 ].className ).toBe( "test another-test disabled" );
			} );

			it( "should remove a classname of a dom element", () => {
				$elem.removeClass( "another-test" );
				expect( $elem.elements[ 0 ].className ).toBe( "test disabled" );
			} );

			it( "should remove multiple classnames-string of a dom element", () => {
				$elem.removeClass( "another-test disabled" );
				expect( $elem.elements[ 0 ].className ).toBe( "test" );
			} );
		} );

		describe( "[MULTIPLE ELEMENTS TESTING]", () => {
			it( "should do nothing by an empty classname for every element", () => {
				$multiElems.addClass( "" );

				expect( $multiElems.elements[ 0 ].className ).toBe( "test another-test disabled" );
				expect( $multiElems.elements[ 1 ].className ).toBe( "object another-test disabled" );
				expect( $multiElems.elements[ 2 ].className ).toBe( "hello another-test disabled" );
			} );

			it( "should remove a classname of some dom elements", () => {
				let className = "disabled";

				$multiElems.removeClass( className );

				expect( $multiElems.elements[ 0 ].className ).toBe( "test another-test");
				expect( $multiElems.elements[ 1 ].className ).toBe( "object another-test" );
				expect( $multiElems.elements[ 2 ].className ).toBe( "hello another-test" );
			} );

			it( "should remove multiple classnames-string of some dom elements", () => {
				let classNames = "another-test disabled";

				$multiElems.removeClass( classNames );

				expect( $multiElems.elements[ 0 ].className ).toBe( "test" );
				expect( $multiElems.elements[ 1 ].className ).toBe( "object" );
				expect( $multiElems.elements[ 2 ].className ).toBe( "hello" );
			} );
		} );
	} );
} );