import $ from "./com.coderwelsch.Query.js";


export default class Overlay {
	constructor ( settings ) {
		this.settings = {
			autoFindImgs: true,
			appendOverlayIfNotFound: false,
			autoSetImageSrc: true,
			scaleFromOrigin: true,
			animationTime: 250,
			lockBodyOnShow: true,
			enableKeyboardControl: true,

			selectors: {
				overlay: "#overlay",
				close: ".close",
				content: ".content",
				appendOverlay: "body"
			},

			classes: {
				active: "active"
			},

			callbacks: {
				onOverlayClosed: undefined,
				onAfterShowOverlay: undefined,
				performCustomOriginElementAnimationFrom: undefined,
				performCustomOriginElementAnimationTo: undefined
			}
		};

		// extend settings
		Object.assign( this.settings, settings );

		// public variables
		this.selectors = this.settings.selectors;
		this.classes = this.settings.classes;

		// plugin variables
		this.$body = new $( document.body );
		this.$overlay = new $( this.selectors.overlay );
		this.$content = this.$overlay.find( this.selectors.content );
		this.$closeBtn = this.$overlay.find( this.selectors.close );
	}

	bindEvents () {
		this.$closeBtn.on( "click", this, this.closeBtnClicked );

		if ( this.settings.enableKeyboardControl ) {
			new $( document ).one( "keydown", this, this.keyPressed );
		}
	}

	setHtml ( html = "" ) {
		if ( !this.$overlay.elements.length && this.settings.appendOverlayIfNotFound ) {
			this.$overlay = new $( `
				<div id='overlay'>
					<div class='close fa fa-close'></div>
					<div class='content'></div>
				</div>
			` ).appendTo( document.body );

			this.$content = this.$overlay.find( this.selectors.content );
			this.$closeBtn = this.$overlay.find( this.selectors.close );
		}

		this.$content.html( html );
	}

	showOverlay ( html = "", $originElement = "" ) {
		this.setHtml( html );
		this.$overlay.addClass( this.classes.active );

		if ( this.settings.scaleFromOrigin && $originElement ) {
			let Velocity = require( "../vendor/velocity/velocity.js" );

			this.$originElement = $originElement;

			let animationFrom = $.calcOriginTransformation( this.$originElement, true ),
				animationTo = {
					translateX: 0,
					translateY: 0,
					scaleX: 1,
					scaleY: 1
				};

			if ( typeof this.settings.callbacks.performCustomOriginElementAnimationFrom === "function" ) {
				animationFrom = this.settings.callbacks.performCustomOriginElementAnimationFrom( animationFrom, $originElement );
			}

			if ( typeof this.settings.callbacks.performCustomOriginElementAnimationTo === "function" ) {
				animationTo = this.settings.callbacks.performCustomOriginElementAnimationTo( animationTo, $originElement );
			}

			Velocity( this.$overlay.get( 0 ), animationFrom, { duration: 0 } );
			Velocity(
				this.$overlay.get( 0 ),
				animationTo,
				{ duration: this.settings.animationTime }
			).then( () => {
				if ( this.settings.lockBodyOnShow ) {
					this.$body.css( "overflow", "hidden" );
				}

				if ( typeof this.settings.callbacks.onAfterShowOverlay === "function" ) {
					this.settings.callbacks.onAfterShowOverlay( this );
				}
			} );
		}

		this.bindEvents();
	}

	static calcOriginTransformation ( $originElement, returnObj ) {
		let scrollX = window.scrollX,
			scrollY = window.scrollY,
			paddingTop = parseInt( $originElement.css( "padding-top" ) ),
			paddingLeft = parseInt( $originElement.css( "padding-left" ) ),
			x = $originElement.offset().left - scrollX - paddingLeft,
			y = $originElement.offset().top - scrollY - paddingTop,
			width = $originElement.width(),
			height = $originElement.height(),
			translate = "translateX(" + x + "px) translateY(" + y + "px)",
			scale = "scaleX(" + width / window.innerWidth + ") scaleY(" + height / window.innerHeight + ")";

		if ( returnObj ) {
			return {
				translateX: x,
				translateY: y,
				scaleX: width / window.innerWidth,
				scaleY: height / window.innerHeight
			};
		} else {
			return translate + " " + scale;
		}
	}

	hideOverlay () {
		this.$overlay.removeClass( this.classes.active );

		if ( this.settings.scaleFromOrigin && this.$originElement ) {
			let Velocity = require( "../vendor/velocity/velocity.js" ),
				transformation = $.calcOriginTransformation( this.$originElement, true );

			Velocity(
				this.$overlay.get( 0 ),
				transformation,
				{ duration: this.settings.animationTime }
			).then( () => {
				if ( typeof this.settings.callbacks.onOverlayClosed === "function" ) {
					this.settings.callbacks.onOverlayClosed( this );
				}
			} );
		} else if ( typeof this.settings.callbacks.onOverlayClosed === "function" ) {
			this.settings.callbacks.onOverlayClosed( this );
		}

		if ( this.settings.lockBodyOnShow ) {
			this.$body.css( "overflow", "" );
		}
	}

	keyPressed ( event ) {
		let self = event.data || this;

		if ( event.keyCode === 27 ) {
			self.hideOverlay();
		} else {
			new $( document ).one( "keydown", this, this.keyPressed );
		}

		// stop event propagation
		return false;
	}

	closeBtnClicked ( event ) {
		let self = event.data || this;

		self.hideOverlay();
	}
}
