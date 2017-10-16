import $ from "./com.coderwelsch.Query.js";
import Utils from "./com.coderwelsch.Utils.js";
import Snabbt from "./../vendor/snabbt.js/src/main.js";


export default class Overlay {
	constructor ( settings ) {
		this.settings = {
			autoFindImgs: true,
			appendOverlayIfNotFound: false,
			scaleFromOrigin: true,
			transitionTime: 250,
			easing: "ease",
			lockBodyOnShow: true,
			enableKeyboardControl: true,
			overlayBaseHtml: undefined,

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
		this.settings = Utils.extend( this.settings, settings );

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
		this.$closeBtn.one( "click", this, this.closeBtnClicked );

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
			this.$overlay = new $( this.settings.overlayBaseHtml || `
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

	showOverlay ( html = "", $originElement = "", doAnimation = true ) {
		this.setHtml( html );

		if ( doAnimation === true && this.settings.scaleFromOrigin && $originElement ) {
			let transform;

			this.$originElement = $originElement;
			transform = Overlay.calcOriginTransformation( this.$originElement );

			Snabbt( this.$overlay.elements[ 0 ], {
				fromPosition: [ transform.translateX, transform.translateY, 0 ],
				fromScale: [ transform.scaleX, transform.scaleY ],
				fromOpacity: 0,

				position: [ 0, 0, 0 ],
				scale: [ 1, 1 ],
				opacity: 1,

				easing: this.settings.easing,
				duration: this.settings.transitionTime
			} );

			if ( typeof this.settings.callbacks.onAfterShowOverlay === "function" ) {
				window.setTimeout( () => {
					this.settings.callbacks.onAfterShowOverlay( this );
				}, this.settings.transitionTime );
			}
		}

		this.$overlay.addClass( this.classes.active );

		if ( this.settings.lockBodyOnShow ) {
			this.$body.css( "overflow", "hidden" );
		}

		this.bindEvents();
	}

	static calcOriginTransformation ( $originElement ) {
		let scrollX = window.scrollX,
			scrollY = window.scrollY,
			paddingTop = parseInt( $originElement.css( "padding-top" ) ),
			paddingLeft = parseInt( $originElement.css( "padding-left" ) ),
			x = $originElement.offset().left - scrollX - paddingLeft,
			y = $originElement.offset().top - scrollY - paddingTop,
			width = $originElement.width(),
			height = $originElement.height();

		return {
			translateX: x,
			translateY: y,
			scaleX: width / window.innerWidth,
			scaleY: height / window.innerHeight
		};
	}

	hideOverlay () {
		this.$overlay.removeClass( this.classes.active );

		if ( this.settings.scaleFromOrigin && this.$originElement ) {
			let transform = Overlay.calcOriginTransformation( this.$originElement );

			Snabbt( this.$overlay.elements[ 0 ], "stop" );
			Snabbt( this.$overlay.elements[ 0 ], {
				fromPosition: [ 0, 0, 0 ],
				fromScale: [ 1, 1 ],
				fromOpacity: 1,

				position: [ transform.translateX, transform.translateY, 0 ],
				scale: [ transform.scaleX, transform.scaleY ],
				opacity: 0,

				easing: this.settings.easing,
				duration: this.settings.transitionTime
			} );

			if ( typeof this.settings.callbacks.onOverlayClosed === "function" ) {
				window.setTimeout( () => {
					this.settings.callbacks.onOverlayClosed( this );
				}, this.settings.transitionTime );
			}
		} else if ( typeof this.settings.callbacks.onOverlayClosed === "function" ) {
			this.settings.callbacks.onOverlayClosed( this );
		}

		if ( this.settings.lockBodyOnShow ) {
			this.$body.css( "overflow", "" );
		}
	}

	isActive () {
		return this.$overlay.hasClass( this.classes.active );
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
