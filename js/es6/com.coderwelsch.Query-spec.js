/* global describe, it, beforeEach, afterEach, expect */
// imports
import $ from "./com.coderwelsch.Query.js";


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

		it( "should create an empty instance by no given params", () => {
			let $elem = new $();

			expect( $elem instanceof $ ).toBe( true );
		} );

		it( "should create an instance by a dom selector", () => {
			let $elem = new $( ".test" );

			expect( $elem.elements.length ).toBe( 1 );
		} );

		it( "should create an instance by a html string", () => {
			let html = "<div class=\"i-love-template-strings\"></div>",
				$elem = new $( html );

			expect( $elem.elements[ 0 ].outerHTML ).toBe( html );
		} );

		it( "should create an instance by a html string", () => {
			let html = `
					<p>Hello, </p>
					<p>World!</p>
				`,
				$elem = new $( html );

			expect( $elem.elements[ 0 ].outerHTML ).toBe( "<p>Hello, </p>" );
			expect( $elem.elements[ 1 ].outerHTML ).toBe( "<p>World!</p>" );
		} );

		it( "should create an instance by a dom element", () => {
			let $elem = new $( document.querySelector( ".test" ) );

			expect( $elem.elements.length ).toBe( 1 );
		} );

		it( "should create an instance by another Query instance", () => {
			let testElem = document.querySelector( ".test" ),
				$elem1 = new $( testElem ),
				$elem2 = new $( $elem1 ),
				classMockObj = { constructor: { name: "$" }, elements: [ testElem ] },
				$elem3 = new $( classMockObj );

			expect( $elem2.elements[ 0 ] ).toBe( testElem );
			expect( $elem3.elements[ 0 ] ).toBe( testElem );
		} );

		it( "should create an instance with empty elements", () => {
			let $elem = new $( ".not-matching-selector" );

			expect( $elem.elements.length ).toBe( 0 );
		} );

		it( "should create an instance by a given html string", () => {
			let htmlString = "<div>Hello, World!</div>",
				$elem = new $( htmlString );

			expect( $elem.elements[ 0 ].outerHTML ).toBe( htmlString );
		} );

		it( "should not create an instance by a given simple string", () => {
			let htmlString = "Hello, World",
				$elem = new $( htmlString );

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
			it( "should return false by an empty query instance", () => {
				expect( new $().hasClass( "" ) ).toBe( false );
			} );

			it( "should return false by an empty query instance and no classList support", () => {
				let $empty = new $( "<div></div>" );

				expect( $empty.hasClass( "" ) ).toBe( false );
			} );

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
			it( "should return false by an empty classname for every element", () => {
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
			it( "should do nothing by no classname", () => {
				$elem.addClass();
				expect( $elem.elements[ 0 ].className ).toBe( "test" );
			} );

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

	describe( "toggleClass()", () => {
		let $elem,
			$elem2,
			$multiElems;

		beforeEach( () => {
			document.body.insertAdjacentHTML( "afterbegin", `
				<div class="wrapper">
					<div class="test active"></div>
					<div class="object"></div>
					<div class="hello"></div>
				</div>
			` );

			$elem = new $( ".wrapper .test" );
			$elem2 = new $( ".wrapper .object" );
			$multiElems = new $( ".wrapper div" );
		} );

		afterEach( () => {
			document.body.removeChild( document.querySelector( ".wrapper" ) );
		} );

		describe( "[SINGLE ELEMENT TESTING]", () => {
			it( "should do nothing when no elements available", () => {
				expect( new $().toggleClass( "" ).elements.length ).toBe( 0 );
			} );

			it( "should do nothing when class is set", () => {
				expect( new $().toggleClass().elements.length ).toBe( 0 );
			} );

			it( "should add the class 'active'", () => {
				$elem.toggleClass( "active" );
				expect( $elem.hasClass( "active" ) ).toBe( false );
			} );

			it( "should remove the class 'active'", () => {
				$elem2.toggleClass( "active" );
				expect( $elem2.hasClass( "active" ) ).toBe( true );
			} );
		} );

		describe( "[MULTIPLE ELEMENTS TESTING]", () => {
			it( "should add the class 'active' on the first element", () => {
				$multiElems.toggleClass( "active" );
				expect( $multiElems.hasClass( "active" ) ).toBe( false );
			} );

			it( "should remove the class 'active' on the first element", () => {
				$multiElems.toggleClass( "active" );
				expect( $multiElems.hasClass( "active" ) ).toBe( false );
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
			it( "should do nothing when no classname is set", () => {
				$elem.removeClass();
				expect( $elem.elements[ 0 ].className ).toBe( "test another-test disabled" );
			} );

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
			it( "should return null when key is null", () => {
				expect( $elem.attr( null ) ).toBe( null );
			} );

			it( "should return itself when attribute was deleted", () => {
				expect( $elem.attr( "data-test", null ) ).toBe( $elem );
			} );

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

			it( "should removes the attribute of the first element", () => {
				$elem.attr( "style", null );
				expect( $elem.attr( "style", null ) ).toBe( $elem );
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
			it( "should return null when no key is set", () => {
				expect( $elem.data() ).toBe( null );
			} );

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

	describe( "find()", () => {
		let $elem;

		beforeEach( () => {
			document.body.innerHTML = "";
			document.body.insertAdjacentHTML( "afterbegin", `
				<div class="wrapper">
					<div class="test" data-test="42">HELLO</div>
					<div class="object" data-test=true>WORLD</div>
					<div class="hello" data-test>WHATS UP?</div>
				</div>

				<div class="wrapper">
					<div class="test2" data-test="42">HELLO</div>
					<div class="object2" data-test=true>WORLD</div>
					<div class="hello2" data-test>WHATS UP?</div>
				</div>
			` );

			$elem = new $( ".wrapper" );
		} );

		afterEach( () => {
			document.body.innerHTML = "";
		} );

		describe( "[SINGLE ELEMENT TESTING]", () => {
			it( "should find nothing when no elements available", () => {
				expect( new $().find().elements.length ).toBe( 0 );
			} );

			it( "should find .test div element in the first wrapper element", () => {
				expect( $elem.find( ".test" ).elements[ 0 ] ).toBe( document.querySelector( ".wrapper .test" ) );
			} );

			it( "should find .test2 div element in the second wrapper element", () => {
				expect( $elem.find( ".test2" ).elements[ 0 ] ).toBe( document.querySelector( ".wrapper .test2" ) );
			} );
		} );

		describe( "[MULTIPLE ELEMENTS TESTING]", () => {
			it( "should find all div elements in the two wrapper containers", () => {
				expect( $elem.find( "div" ).elements.length ).toBe( 6 );
			} );
		} );
	} );

	describe( "offset()", () => {
		let $elem;

		beforeEach( () => {
			document.body.innerHTML = "";
			document.body.insertAdjacentHTML( "afterbegin", `
				<div class="wrapper">
					<div class="test" data-test="42">HELLO</div>
					<div class="object" data-test=true>WORLD</div>
					<div class="hello" data-test>WHATS UP?</div>
				</div>

				<div class="wrapper">
					<div class="test2" data-test="42">HELLO</div>
					<div class="object2" data-test=true>WORLD</div>
					<div class="hello2" data-test>WHATS UP?</div>
				</div>
			` );

			$elem = new $( ".wrapper" );
		} );

		afterEach( () => {
			document.body.innerHTML = "";
		} );

		describe( "[SINGLE ELEMENT TESTING]", () => {
			it( "should just return itselfs when no elements available", () => {
				let $test = new $();

				expect( $test.offset().top ).toBe( 0 ); 
				expect( $test.offset().left ).toBe( 0 ); 
			} );

			it( "should get the right offset of the wrapper element", () => {
				expect( $elem.offset().top ).toBe( 8 );
				expect( $elem.offset().left ).toBe( 8 ); 
			} );

			it( "should get the right offset of the wrapper element when css positions are set", () => {
				$elem.elements[ 0 ].style.position = "absolute";
				$elem.elements[ 0 ].style.top = "20px";
				$elem.elements[ 0 ].style.left = "50px";

				expect( $elem.offset().top ).toBe( 20 );
				expect( $elem.offset().left ).toBe( 50 );
			} );

			it( "should get the right offset of the wrapper element when css margins are set", () => {
				$elem.elements[ 0 ].style.marginTop = "60px";
				$elem.elements[ 0 ].style.marginLeft = "60px";

				expect( $elem.offset().top ).toBe( 60 );
				expect( $elem.offset().left ).toBe( 68 );
			} );
		} );
	} );

	describe( "append()", () => {
		let $elem;

		beforeEach( () => {
			document.body.innerHTML = "";
			document.body.insertAdjacentHTML( "afterbegin", `
				<div class="wrapper"></div>
				<div class="test">Hey</div>
			` );

			$elem = new $( ".wrapper" );
		} );

		afterEach( () => {
			document.body.innerHTML = "";
		} );

		describe( "[SINGLE ELEMENT TESTING]", () => {
			it( "should append nothing when no elements defined", () => {
				let $test = new $();
				$test.append( $elem );

				expect( $test.append() ).toBe( $test );
			} );

			it( "should append nothing when no params are set", () => {
				let elemsBefore = $elem.elements.length,
					elemsAfter = $elem.append().elements.length;

				expect( elemsBefore ).toBe( elemsAfter );
			} );

			it( "should append a created dom element to .wrapper", () => {
				let newElem = document.createElement( "div" );
				newElem.className = "created-element";

				expect( $elem.append( newElem ).elements[ 0 ].outerHTML ).toBe( "<div class=\"wrapper\"><div class=\"created-element\"></div></div>" );
			} );

			it( "should append a html string to .wrapper", () => {
				let html = "<div>HELLO</div>";

				expect( $elem.append( html ).elements[ 0 ].outerHTML ).toBe( "<div class=\"wrapper\"><div>HELLO</div></div>" );
			} );

			it( "should append a dom element by a given selector to .wrapper", () => {
				expect( $elem.append( ".test" ).elements[ 0 ].outerHTML ).toBe( "<div class=\"wrapper\"><div class=\"test\">Hey</div></div>" );
			} );

			it( "should append a Query instance (created with a html string) to .wrapper", () => {
				expect( $elem.append( new $( "<p>My Name Is Paragraph.</p>" ) ).elements[ 0 ].outerHTML ).toBe( "<div class=\"wrapper\"><p>My Name Is Paragraph.</p></div>" );
			} );
		} );
	} );

	describe( "appendTo()", () => {
		let $elem;

		beforeEach( () => {
			document.body.innerHTML = "";
			document.body.insertAdjacentHTML( "afterbegin", `
				<div class="wrapper"></div>
				<div class="test">Hey</div>
			` );

			$elem = new $( ".wrapper" );
		} );

		afterEach( () => {
			document.body.innerHTML = ""; 
		} );

		describe( "[SINGLE ELEMENT TESTING]", () => {
			it( "should return itselfs when no elements available", () => {
				expect( new $().appendTo() instanceof $ ).toBe( true );
			} );

			it( "should append a new Query object to a dom element", () => {
				( new $( "<div>Im a div</div" ) ).appendTo( $elem );
				expect( $elem.elements[ 0 ].outerHTML ).toBe( "<div class=\"wrapper\"><div>Im a div</div></div>" );
			} );

			it( "should append to another Query element", () => {
				new $( "<div class='i-am-new'>HELLO</div>" ).appendTo( $elem );
				expect( $elem.find( ".i-am-new" ).elements.length ).toBe( 1 );
			} );

			it( "should append to a native dom element", () => {
				let testElem = document.querySelector( ".wrapper" ),
					$appended = new $( "<div class='i-am-new'>HELLO</div>" ).appendTo( testElem );

				expect( testElem.querySelector( ".i-am-new" ) ).toBe( $appended.elements[ 0 ] ); 
			} );
		} );
	} );

	describe( "css()", () => {
		let $elem;

		beforeEach( () => {
			document.body.innerHTML = "";
			document.body.insertAdjacentHTML( "afterbegin", `
				<style>
					.wrapper {
						-webkit-transform: translateX(10px);
					}

					.computed {
						background-color: green;
					}
				</style>
				<div class="wrapper">
					<div class="absolute" style="position: absolute;"></div>
					<div class="computed">Bubu</div>
				</div>
			` );

			$elem = new $( ".wrapper" );
		} );

		afterEach( () => {
			document.body.innerHTML = "";
		} );

		describe( "[SINGLE ELEMENT TESTING]", () => {
			describe( "get css values", () => {
				it( "should return itselfs when no elements available", () => {
					let $test = new $();
					expect( $test.css() ).toBe( $test );
				} );

				it( "should get the style-attribute css 'position' value", () => {
					expect( $elem.find( ".absolute" ).css( "position" ) ).toBe( "absolute" );
				} );

				it( "should get the global style css 'position' value", () => {
					expect( $elem.find( ".computed" ).css( "background-color" ) ).toBe( "rgb(0, 128, 0)" );
				} );

				it( "should get the not-set style attr 'clip'", () => {
					expect( $elem.css( "clip" ) ).toBe( "auto" );
				} );

				it( "should get the vendor-prefixed style value '-webkit-transform'", () => {
					expect( $elem.css( "-webkit-transform" ) ).toBe( "matrix(1, 0, 0, 1, 10, 0)" );
				} );

				it( "should not get the vendor-prefixed style value '-moz-transform'", () => {
					expect( $elem.css( "-moz-transform" ) ).toBe( undefined );
				} );

				it( "should set multiple css values by object", () => {
					$elem.css( {
						display: "none",
						backgroundColor: "blue"
					} );

					expect( $elem.elements[ 0 ].style.display ).toBe( "none" );
					expect( $elem.elements[ 0 ].style.backgroundColor ).toBe( "blue" );
				} );
			} );

			describe( "set css values", () => {
				it( "should set the style-attribute css 'position' value", () => {
					$elem.find( ".absolute" ).css( "position", "fixed" );

					expect( $elem.find( ".absolute" ).css( "position" ) ).toBe( "fixed" );
				} );

				it( "should set the global style css 'position' value", () => {
					$elem.find( ".computed" ).css( "background-color", "blue" );

					expect( $elem.find( ".computed" ).css( "background-color" ) ).toBe( "rgb(0, 0, 255)" );
				} );

				it( "should set the not-set style attr 'clip'", () => {
					$elem.css( "clip", "rect(0px 0px 0px 0px)" );

					expect( $elem.css( "clip" ) ).toBe( "rect(0px 0px 0px 0px)" );
				} );

				it( "should not set the vendor-prefixed style value '-moz-transform'", () => {
					$elem.css( "-moz-transform", "scale(1, 1)" );

					expect( $elem.css( "-moz-transform" ) ).toBe( undefined );
				} );
			} );
		} );
	} );

	describe( "next()", () => {
		let $elem1,
			$elem2;

		beforeEach( () => {
			document.body.innerHTML = "";
			document.body.insertAdjacentHTML( "afterbegin", `
				<div class="wrapper">
					<div class="absolute">Hello</div>
					<div class="computed">World</div>
				</div>
			` );

			$elem1 = new $( ".wrapper .absolute" );
			$elem2 = new $( ".wrapper .computed" );
		} );

		afterEach( () => {
			document.body.innerHTML = "";
		} );

		describe( "[SINGLE ELEMENT TESTING]", () => {
			it( "should return itselfs when no elements available", () => {
				let $test = new $();
				expect( $test.next() ).toBe( $test );
			} );

			it( "should get the next element sibling", () => {
				expect( $elem1.next().elements[ 0 ] ).toBe( $elem2.elements[ 0 ] );
			} );

			it( "should return the first element when element is the last one", () => {
				expect( $elem2.next().elements[ 0 ] ).toBe( $elem1.elements[ 0 ] );
			} );
		} );
	} );

	describe( "prev()", () => {
		let $elem1,
			$elem2;

		beforeEach( () => {
			document.body.innerHTML = "";
			document.body.insertAdjacentHTML( "afterbegin", `
				<div class="wrapper">
					<div class="absolute">Hello</div>
					<div class="computed">World</div>
				</div>
			` );

			$elem1 = new $( ".wrapper .absolute" );
			$elem2 = new $( ".wrapper .computed" );
		} );

		afterEach( () => {
			document.body.innerHTML = "";
		} );

		describe( "[SINGLE ELEMENT TESTING]", () => {
			it( "should return itselfs when no elements available", () => {
				let $test = new $();

				expect( $test.prev() ).toBe( $test );
			} );

			it( "should get the next element sibling", () => {
				expect( $elem2.prev().elements[ 0 ] ).toBe( $elem1.elements[ 0 ] );
			} );

			it( "should return the last element when element is the first one", () => {
				expect( $elem1.prev().elements[ 0 ] ).toBe( $elem2.elements[ 0 ] );
			} );
		} );
	} );

	describe( "on()", () => {
		let $elem;

		beforeEach( () => {
			document.body.innerHTML = "";
			document.body.insertAdjacentHTML( "afterbegin", `
				<div class="button">Im a button</div>;
			` );

			$elem = new $( ".button" );
		} );

		describe( "[SINGLE ELEMENT TESTING]", () => {
			it( "should return itselfs when no elements available", () => {
				let $test = new $();

				expect( $test.on() ).toBe( $test );
			} );

			it( "should call the click event function", () => {
				$elem.on( "click", () => {
					expect( true ).toBe( true );
				} );

				$elem.elements[ 0 ].click();
			} );

			it( "should call only one times the click event function", () => {
				let callCount = 0;

				$elem.one( "click", () => {
					callCount++;
				} );

				$elem.elements[ 0 ].click();
				$elem.elements[ 0 ].click();

				expect( callCount ).toBe( 1 );
			} );

			it( "should pass the event to the event function", () => {
				$elem.on( "click", ( event ) => {
					expect( event && event !== undefined ).toBe( true );
				} );

				$elem.elements[ 0 ].click();
			} );

			it( "should pass a valid event to callback function", () => {
				$elem.on( "click", ( event ) => {
					expect( event.currentTarget === $elem.elements[ 0 ] ).toBe( true );
				} );

				$elem.elements[ 0 ].click();
			} );
		} );
	} );

	describe( "trigger()", () => {
		let $elem,
			$multiElems;

		beforeEach( () => {
			document.body.innerHTML = "";
			document.body.insertAdjacentHTML( "afterbegin", `
				<div class="button">Im a button</div>
				<div class="test">Im a button</div>
				<div class="test">Im a button</div>
				<div class="test">Im a button</div>
			` );

			$elem = new $( ".button" );
			$multiElems = new $( ".test" );
		} );

		describe( "[SINGLE ELEMENT TESTING]", () => {
			it( "should do nothing when no elements found", () => {
				let $empty = new $(),
					callCount = 0;

				$empty.on( "click", () => {
					callCount++;
				} );

				$empty.trigger( "click" );
				expect( callCount ).toBe( 0 );
			} );

			it( "should call the triggered function", () => {
				let callCount = 0;

				$elem.get( 0 ).onclick = () => {
					callCount++;
				};

				$elem.trigger( "click" );

				expect( callCount ).toBe( 1 );
			} );
		} );

		describe( "[MULTIPLE ELEMENTS TESTING]", () => {
			it( "should call the triggered functions of the elements", () => {
				let callCount = 0;

				$multiElems.on( "click", () => {
					callCount++;
				} );

				$multiElems.trigger( "click" );

				expect( callCount ).toBe( $multiElems.elements.length );
			} );
		} );
	} );

	describe( "parent()", () => {
		let $elem;

		beforeEach( () => {
			document.body.innerHTML = "";
			document.body.insertAdjacentHTML( "afterbegin", `
				<div class="wrapper">
					<div class="parent">
						<div class="parent-root"></div>
					</div>
				</div>
			` );

			$elem = new $( ".parent-root" );
		} );

		describe( "[SINGLE ELEMENT TESTING]", () => {
			it( "should return a new instance when no elements available", () => {
				let $test = new $();

				expect( $test.parent() === $test ).toBe( false );
			} );

			it( "should return the parent element", () => {
				expect( $elem.parent().parent().elements[ 0 ] === new $( ".wrapper" ).elements[ 0 ] ).toBe( true );
			} );
		} );
	} );

	describe( "width()", () => {
		let $elem,
			$withMargin;

		beforeEach( () => {
			document.body.innerHTML = "";
			document.body.insertAdjacentHTML( "afterbegin", `
				<div class="fixed-width" style="width: 300px;"></div>
				<div class="fixed-width-margin" style="width: 300px; margin: 10px;"></div>
			` );

			$elem = new $( ".fixed-width" );
			$withMargin = new $( ".fixed-width-margin" );
		} );

		describe( "[SINGLE ELEMENT TESTING]", () => {
			it( "should return 0 when no elements available", () => {
				expect( new $().width() ).toBe( 0 );
			} );

			it( "should return the right elements width without margins and paddings", () => {
				expect( $elem.width() ).toBe( 300 );
			} );

			it( "should return the right elements width with margins and paddings", () => {
				expect( $withMargin.width() ).toBe( 300 );
			} );
		} );
	} );

	describe( "height()", () => {
		let $elem,
			$withMargin;

		beforeEach( () => {
			document.body.innerHTML = "";
			document.body.insertAdjacentHTML( "afterbegin", `
				<div class="fixed-height" style="height: 300px;"></div>
				<div class="fixed-height-margin" style="height: 300px; margin: 10px;"></div>
			` );

			$elem = new $( ".fixed-height" );
			$withMargin = new $( ".fixed-height-margin" );
		} );

		describe( "[SINGLE ELEMENT TESTING]", () => {
			it( "should return 0 when no elements available", () => {
				expect( new $().height() ).toBe( 0 );
			} );

			it( "should return the right elements height without margins and paddings", () => {
				expect( $elem.height() ).toBe( 300 );
			} );

			it( "should return the right elements height with margins and paddings", () => {
				expect( $withMargin.height() ).toBe( 300 );
			} );
		} );
	} );

	describe( "text()", () => {
		let $elem;

		beforeEach( () => {
			document.body.innerHTML = "";
			document.body.insertAdjacentHTML( "afterbegin", `
				<p class="test-me">TEST</p>
			` );

			$elem = new $( ".test-me" );
		} );

		afterEach( () => {
			document.body.innerHTML = "";
		} );

		describe( "[SINGLE ELEMENT TESTING]", () => {
			it( "should return empty string when no elements available", () => {
				let $test = new $();
				expect( $test.text() ).toBe( "" );
			} );

			it( "should get the text", () => {
				expect( $elem.text() ).toBe( "TEST" );
			} );

			it( "should set the text", () => {
				expect( $elem.text( "THORSTEN" ).text() ).toBe( "THORSTEN" );
			} );
		} );
	} );

	describe( "html()", () => {
		let $elem;

		beforeEach( () => {
			document.body.innerHTML = "";
			document.body.insertAdjacentHTML( "afterbegin", `
				<p class="test-me">
					<span>TRUST ME, I AM AN ENGINEER!</span>
				</p>
			` );

			$elem = new $( ".test-me" );
		} );

		afterEach( () => {
			document.body.innerHTML = "";
		} );

		describe( "[SINGLE ELEMENT TESTING]", () => {
			it( "should return empty string when no elements available", () => {
				let $test = new $();
				expect( $test.html() ).toBe( "" );
			} );

			it( "should get the html", () => {
				expect( $elem.html().trim() ).toBe( "<span>TRUST ME, I AM AN ENGINEER!</span>" );
			} );

			it( "should set the html", () => {
				expect( $elem.html( "<p>ELFRIEDE</p>" ).html() ).toBe( "<p>ELFRIEDE</p>" );
			} );
		} );
	} );

	describe( "val()", () => {
		let $elem;

		beforeEach( () => {
			document.body.innerHTML = "";
			document.body.insertAdjacentHTML( "afterbegin", `
				<input type="password" class="top-secret-yo" value="schalke04" />
			` );

			$elem = new $( ".top-secret-yo" );
		} );

		afterEach( () => {
			document.body.innerHTML = "";
		} );

		describe( "[SINGLE ELEMENT TESTING]", () => {
			it( "should return empty string when no elements available", () => {
				let $test = new $();
				expect( $test.val() ).toBe( null );
			} );

			it( "should get the value", () => {
				expect( $elem.val() ).toBe( "schalke04" );
			} );

			it( "should set the value", () => {
				expect( $elem.val( "password" ).val() ).toBe( "password" );
			} );
		} );
	} );

	describe( "get()", () => {
		let $elem;

		beforeEach( () => {
			document.body.innerHTML = "";
			document.body.insertAdjacentHTML( "afterbegin", `
				<ul class="list">
					<li>1</li>
					<li>2</li>
					<li>3</li>
				</ul>
			` );

			$elem = new $( ".list li" );
		} );

		afterEach( () => {
			document.body.innerHTML = "";
		} );

		it( "should return null when no elements available", () => {
			let $test = new $();
			expect( $test.get( 0 ) ).toBe( null );
		} );

		it( "should return null when index is out of bounce", () => {
			expect( $elem.get( Number.MAX_VALUE ) ).toBe( null );
		} );

		it( "should get the first elem", () => {
			expect( $elem.get() ).toBe( $elem.elements[ 0 ] );
		} );

		it( "should get the first elem", () => {
			expect( $elem.get( 0 ) ).toBe( $elem.elements[ 0 ] );
		} );

		it( "should get the last elem", () => {
			expect( $elem.get( 2 ) ).toBe( $elem.elements[ 2 ] );
		} );
	} );

	describe( "closest()", () => {
		let $elem;

		beforeEach( () => {
			document.body.innerHTML = "";
			document.body.insertAdjacentHTML( "afterbegin", `
				<div class="franz">
					<div class="brunhilde">
						<div class="franz">
							<ul class="moritz">
								<li>1</li>
								<li>2</li>
								<li>3</li> 
							</ul>
						</div>
					</div>
				</div>
			` );

			$elem = new $( "ul.moritz" );
		} );

		afterEach( () => {
			document.body.innerHTML = "";
		} );

		it( "should return null when no elements available", () => {
			let $test = new $();
			expect( $test.closest( ".franz" ) ).toBe( null );
		} );

		it( "should return closest '.franz' element", () => {
			expect( $elem.closest( ".franz" ).get( 0 ) ).toBe( $elem.get( 0 ).parentNode );
		} );

		it( "should return null", () => {
			expect( new $( document.body ).closest( ".franz" ) ).toBe( null );
		} );
	} );

	describe( "measureScrollbarWidth()", () => {
		it( "should return the standard phantomjs browser scrollbar width", () => {
			if ( window.navigator.userAgent.indexOf( "PhantomJS" ) ) {
				expect( $.measureScrollbarWidth() ).toBe( 16 );
			} else if ( window.navigator.userAgent.indexOf( "Chrome" ) ) {
				expect( $.measureScrollbarWidth() ).toBe( 15 );
			}
		} );
	} );

	// describe( "ajax()", () => {
	// 	it( "should fail by loading a wrong url", ( done ) => {
	// 		$.ajax( {
	// 			url: "test.html",
				
	// 			callbacks: {
	// 				success: () => { console.log( 22 ); done(); },
	// 				fail: ( error ) => {
	// 					done();
	// 				}
	// 			}
	// 		} );
	// 	} );
	// } );

	// TODO: toggleClass()
	// TODO: one()
	// TODO: get()
	// TODO: convertSnakeCaseToCamelCase()
	// TODO: splitClassNames()
} );
