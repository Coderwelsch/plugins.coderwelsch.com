import $ from "./com.coderwelsch.Query.js";


export default class Overlay {
	constructor ( settings ) {
		this.settings = {
			autoFindImgs: true,
			appendOverlayIfNotFound: false,
			scaleFromOrigin: true,
			cssTransitionTime: 250,
			lockBodyOnShow: true,
			enableKeyboardControl: true,

			selectors: {
				overlay: "#overlay",
				close: ".close",
				content: ".content",
				appendOverlay: "body"
			},

			classes: {
				active: "active",
				enableTransitions: "enable-transitions"
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
			new $( document.body ).one( "keydown", this, this.keyPressed );
		}
	}

	setHtml ( html = "" ) {
		let $overlay = new $( "#overlay" );

		if ( $overlay.elements.length ) {
			this.$overlay = $overlay;
			this.$content = this.$overlay.find( this.selectors.content );
			this.$closeBtn = this.$overlay.find( this.selectors.close );
		} else if ( !this.$overlay.elements.length && this.settings.appendOverlayIfNotFound ) {
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

		if ( this.settings.scaleFromOrigin && $originElement ) {
			let from;

			this.$originElement = $originElement;
			from = Overlay.calcOriginTransformation( this.$originElement );

			// set initial css animation state
			this.$overlay.css( {
				transform: from,
				mozTransform: from,
				webkitTransform: from
			} );

			// now enables transitions/animations
			this.$overlay.addClass( this.classes.enableTransitions );
			this.$overlay.css( {
				transform: "",
				mozTransform: "",
				webkitTransform: ""
			} );


			if ( typeof this.settings.callbacks.onAfterShowOverlay === "function" ) {
				window.setTimeout( () => {
					this.settings.callbacks.onAfterShowOverlay( this );
				}, this.settings.cssTransitionTime );
			}
		}

		this.$overlay.addClass( this.classes.active );
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
			let from = Overlay.calcOriginTransformation( this.$originElement );

			this.$overlay.css( {
				transform: from,
				mozTransform: from,
				webkitTransform: from
			} );

			this.$overlay.removeClass( this.classes.active );

			if ( typeof this.settings.callbacks.onOverlayClosed === "function" ) {
				window.setTimeout( () => {
					this.$overlay.removeClass( this.classes.enableTransitions );


					this.settings.callbacks.onOverlayClosed( this );
				}, this.settings.cssTransitionTime );
			}
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
