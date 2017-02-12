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
			let $elem1 = new $( document.querySelector( ".test" ) ),
				$elem2 = new $( $elem1 );

			expect( $elem2.elements[ 0 ] ).toBe( document.querySelector( ".test" ) );
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
			it( "should append a new Query object to a dom element", () => {
				( new $( "<div>Im a div</div" ) ).appendTo( $elem );
				expect( $elem.elements[ 0 ].outerHTML ).toBe( "<div class=\"wrapper\"><div>Im a div</div></div>" );
			} );
		} );
	} );

	// TODO: css()
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
	
	// TODO: on()
	// TODO: one()
	// TODO: width()
	// TODO: height()
	// TODO: get()
	// TODO: convertSnakeCaseToCamelCase()
	// TODO: splitClassNames()
} );
