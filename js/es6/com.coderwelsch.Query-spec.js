/* global describe, it, beforeEach, afterEach, expect */
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
				<div class="wrapper">
					<div class="test"></div>
					<div class="object"></div>
					<div class="hello"></div>
				</div>
			` );

			$elem = new $( ".wrapper .test" );
			$multiElems = new $( ".wrapper div" );
		} );

		afterEach( () => {
			document.body.removeChild( document.querySelector( ".wrapper" ) );
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
				<div class="wrapper">
					<div class="test"></div>
					<div class="object"></div>
					<div class="hello"></div>
				</div>
			` );

			$elem = new $( ".test" );
			$multiElems = new $( ".test, .object, .hello" );
		} );

		afterEach( () => {
			document.body.removeChild( document.querySelector( ".wrapper" ) );
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

				expect( $multiElems.elements[ 0 ].className ).toBe( "test another-test" );
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

	describe( "first()", () => {
		let $elem,
			$multiElems;

		beforeEach( () => {
			document.body.insertAdjacentHTML( "afterbegin", `
				<div class="wrapper">
					<div class="test"></div>
					<div class="object"></div>
					<div class="hello"></div>
				</div>
			` );

			$elem = new $( ".wrapper .test" );
			$multiElems = new $( ".wrapper div" );
		} );

		afterEach( () => {
			document.body.removeChild( document.querySelector( ".wrapper" ) );
		} );

		describe( "[SINGLE ELEMENT TESTING]", () => {
			it( "should return an empty new instance of Query", () => {
				expect( ( new $() ).elements.length ).toBe( 0 );
			} );

			it( "should return a new Query instance of the first element", () => {
				expect( $elem.first().elements[ 0 ] ).toBe( $elem.elements[ 0 ] );
			} );
		} );

		describe( "[MULTIPLE ELEMENTS TESTING]", () => {
			it( "should return a new Query instance of the first element", () => {
				expect( $multiElems.first().elements[ 0 ] ).toBe( $multiElems.elements[ 0 ] );
			} );
		} );
	} );

	describe( "empty()", () => {
		let $elem,
			$multiElems;

		beforeEach( () => {
			document.body.insertAdjacentHTML( "afterbegin", `
				<div class="wrapper">
					<div class="test">HELLO</div>
					<div class="object">WORLD</div>
					<div class="hello">WHATS UP?</div>
				</div>
			` );

			$elem = new $( ".wrapper .test" );
			$multiElems = new $( ".wrapper div" );
		} );

		afterEach( () => {
			document.body.removeChild( document.querySelector( ".wrapper" ) );
		} );

		describe( "[SINGLE ELEMENT TESTING]", () => {
			it( "should empty the elements inner html", () => {
				$elem.empty();

				expect( $elem.elements[ 0 ].innerHTML ).toBe( "" );
			} );
		} );

		describe( "[MULTIPLE ELEMENTS TESTING]", () => {
			it( "should empty all elements inner html", () => {
				$multiElems.empty();

				expect( $multiElems.elements[ 0 ].innerHTML ).toBe( "" );
				expect( $multiElems.elements[ 1 ].innerHTML ).toBe( "" );
				expect( $multiElems.elements[ 2 ].innerHTML ).toBe( "" );
			} );
		} );
	} );

	describe( "each()", () => {
		let $elem,
			$multiElems;

		beforeEach( () => {
			document.body.insertAdjacentHTML( "afterbegin", `
				<div class="wrapper">
					<div class="test">HELLO</div>
					<div class="object">WORLD</div>
					<div class="hello">WHATS UP?</div>
				</div>
			` );

			$elem = new $( ".wrapper .test" );
			$multiElems = new $( ".wrapper div" );
		} );

		afterEach( () => {
			document.body.removeChild( document.querySelector( ".wrapper" ) );
		} );

		describe( "[SINGLE ELEMENT TESTING]", () => {
			it( "should iterate over one element without returning new dom element Query instances", () => {
				let count = 0;

				$elem.each( ( elem ) => {
					count++;
					expect( elem instanceof window.HTMLElement ).toBe( true );
				} );

				expect( count ).toBe( 1 );
			} );

			it( "should iterate over one element with returning new dom element Query instances", () => {
				let count = 0;

				$elem.each( ( $item ) => {
					count++;
					expect( $item instanceof $ ).toBe( true );
				}, true );

				expect( count ).toBe( 1 );
			} );
		} );

		describe( "[MULTIPLE ELEMENTS TESTING]", () => {
			it( "should iterate over some elements without returning new dom element Query instances", () => {
				let count = 0;

				$multiElems.each( ( elem ) => {
					count++;
					expect( elem instanceof window.HTMLElement ).toBe( true );
				} );

				expect( count ).toBe( 3 );
			} );

			it( "should iterate over some elements with returning new dom element Query instances", () => {
				let count = 0;

				$multiElems.each( ( $item ) => {
					count++;
					expect( $item instanceof $ ).toBe( true );
				}, true );

				expect( count ).toBe( 3 );
			} );
		} );
	} );

	describe( "html()", () => {
		let $elem,
			$multiElems;

		beforeEach( () => {
			document.body.insertAdjacentHTML( "afterbegin", `
				<div class="wrapper">
					<div class="test">HELLO</div>
					<div class="object">WORLD</div>
					<div class="hello">WHATS UP?</div>
				</div>
			` );

			$elem = new $( ".wrapper .test" );
			$multiElems = new $( ".wrapper div" );
		} );

		afterEach( () => {
			document.body.removeChild( document.querySelector( ".wrapper" ) );
		} );

		describe( "[SINGLE ELEMENT TESTING]", () => {
			it( "should return the inner html of the first element", () => {
				expect( $elem.html() ).toBe( "HELLO" );
			} );

			it( "should return the outer html of the first element", () => {
				expect( $elem.html( true ) ).toBe( "<div class=\"test\">HELLO</div>" );
			} );

			it( "should set the inner html of the first element", () => {
				let html = "HELLO YOU TOO!";

				$elem.html( html );
				expect( $elem.elements[ 0 ].innerHTML ).toBe( html );
			} );
		} );

		describe( "[MULTIPLE ELEMENTS TESTING]", () => {
			it( "should return the inner html of the first element", () => {
				expect( $multiElems.html() ).toBe( "HELLO" );
			} );

			it( "should return the outer html of the first element", () => {
				expect( $multiElems.html( true ) ).toBe( "<div class=\"test\">HELLO</div>" );
			} );

			it( "should set the inner html of all elements", () => {
				let html = "HELLO YOU TOO!";

				$multiElems.html( html );
				$multiElems.each( ( item ) => {
					expect( item.innerHTML ).toBe( html );
				} );
			} );
		} );
	} );

	describe( "attr()", () => {
		let $elem,
			$multiElems;

		beforeEach( () => {
			document.body.insertAdjacentHTML( "afterbegin", `
				<div class="wrapper">
					<div class="test" data-test="42" style="color: green;">HELLO</div>
					<div class="object" tabindex=0>WORLD</div>
					<div class="hello">WHATS UP?</div>
				</div>
			` );

			$elem = new $( ".wrapper .test" );
			$multiElems = new $( ".wrapper div" );
		} );

		afterEach( () => {
			document.body.removeChild( document.querySelector( ".wrapper" ) );
		} );

		describe( "[SINGLE ELEMENT TESTING]", () => {
			it( "should return first element's attribute 'data-test'", () => {
				expect( $elem.attr( "data-test" ) ).toBe( "42" );
			} );

			it( "should return first element's attribute 'style'", () => {
				expect( $elem.attr( "style" ) ).toBe( "color: green;" );
			} );

			it( "should set first element's attribute 'data-test'", () => {
				$elem.attr( "data-test", "666" );
				expect( $elem.attr( "data-test" ) ).toBe( "666" );
			} );

			it( "should set first element's attribute 'style'", () => {
				$elem.attr( "style", "color: blue;" );
				expect( $elem.attr( "style" ) ).toBe( "color: blue;" );
			} );
		} );

		describe( "[MULTIPLE ELEMENTS TESTING]", () => {
			it( "should return first element's attribute 'data-test'", () => {
				expect( $multiElems.attr( "data-test" ) ).toBe( "42" );
			} );

			it( "should return first element's attribute 'style'", () => {
				expect( $multiElems.attr( "style" ) ).toBe( "color: green;" );
			} );

			it( "should set all elements attributes 'data-test'", () => {
				$multiElems.attr( "data-test", "666" );
				$multiElems.each( ( $item ) => {
					expect( $item.attr( "data-test" ) ).toBe( "666" );
				}, true );
			} );

			it( "should set all element's attributes 'style'", () => {
				$multiElems.attr( "style", "color: blue;" );
				$multiElems.each( ( $item ) => {
					expect( $item.attr( "style" ) ).toBe( "color: blue;" );
				}, true );
			} );
		} );
	} );

	describe( "data()", () => {
		let $elem,
			$multiElems;

		beforeEach( () => {
			document.body.insertAdjacentHTML( "afterbegin", `
				<div class="wrapper">
					<div class="test" data-test="42">HELLO</div>
					<div class="object" data-test=true>WORLD</div>
					<div class="hello" data-test>WHATS UP?</div>
				</div>
			` );

			$elem = new $( ".wrapper .test" );
			$multiElems = new $( ".wrapper div" );
		} );

		afterEach( () => {
			document.body.removeChild( document.querySelector( ".wrapper" ) );
		} );

		describe( "[SINGLE ELEMENT TESTING]", () => {
			it( "should return first element's data attribute 'data-test'", () => {
				expect( $elem.data( "test" ) ).toBe( "42" );
			} );

			it( "should return first element's data attribute 'data-test' with key suffix 'data-'", () => {
				expect( $elem.data( "data-test" ) ).toBe( "42" );
			} );

			it( "should return null on not defined data attribute", () => {
				expect( $elem.data( "yolo" ) ).toBe( null );
			} );

			it( "should set first element's data attribute 'data-test' to 'hello-world'", () => {
				$elem.data( "test", "hello-world" );
				expect( $elem.data( "test" ) ).toBe( "hello-world" );
			} );
		} );

		describe( "[MULTIPLE ELEMENTS TESTING]", () => {
			it( "should return first element's data attribute 'data-test'", () => {
				expect( $multiElems.data( "test" ) ).toBe( "42" );
			} );

			it( "should return first element's data attribute 'data-test' with key suffix 'data-'", () => {
				expect( $multiElems.data( "data-test" ) ).toBe( "42" );
			} );

			it( "should return null on not defined data attribute", () => {
				expect( $multiElems.data( "yolo" ) ).toBe( null );
			} );

			it( "should set all element's data attributes 'data-test' to 'hello-world'", () => {
				$multiElems.data( "test", "hello-world" );

				$multiElems.each( ( $item ) => {
					expect( $item.data( "test" ) ).toBe( "hello-world" );
				}, true );
			} );
		} );
	} );
} );