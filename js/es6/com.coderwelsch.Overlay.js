class Overlay {
	constructor ( settings ) {
		this.settings = {
			autoFindImgs: true,
			appendOverlayIfNotFound: false,
			autoSetImageSrc: true,
			scaleFromOrigin: true,
			animationTime: 250,
			lockBodyOnShow: true,

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
		window.$.extend( true, this.settings, settings );

		// public variables
		this.selectors = this.settings.selectors;
		this.classes = this.settings.classes;

		// plugin variables
		this.$body = window.$( document.body );
		this.$overlay = window.$( this.selectors.overlay );
		this.$content = this.$overlay.find( this.selectors.content );
		this.$closeBtn = this.$overlay.find( this.selectors.close );
	}

	bindEvents () {
		this.$closeBtn.on( "click", this, this.closeBtnClicked );
		window.$( document ).one( "keydown", this, this.keyPressed );
	}

	showOverlay ( html = "", $originElement = "" ) {
		if ( this.$overlay.length === 0 && this.settings.appendOverlayIfNotFound ) {
			this.$overlay = window.$( `
				<div id='overlay'>
					<div class='close fa fa-close'></div>
					<div class='content'></div>
				</div>
			` ).appendTo( this.selectors.appendOverlay );
			this.$content = this.$overlay.find( this.selectors.content );
			this.$closeBtn = this.$overlay.find( this.selectors.close );
		}

		this.$content.html( html );
		this.$overlay.addClass( this.classes.active );

		if ( $originElement ) {
			this.$originElement = $originElement;

			let animationFrom = {
					"transform": this.calcOriginTransformation( this.$originElement )
				},
				animationTo = {
					"transform": "translate( 0, 0 ), scale( 1, 1 )"
				};

			if ( typeof this.settings.callbacks.performCustomOriginElementAnimationFrom === "function" ) {
				animationFrom = this.settings.callbacks.performCustomOriginElementAnimationFrom( animationFrom, $originElement );
			}

			this.$overlay
				.stop()
				.css( animationFrom );

			if ( typeof this.settings.callbacks.performCustomOriginElementAnimationTo === "function" ) {
				animationTo = this.settings.callbacks.performCustomOriginElementAnimationTo( animationTo, $originElement );
			}

			this.$overlay
				.stop()
				.animate( animationTo, this.settings.animationTime, () => {
					if ( this.settings.lockBodyOnShow ) {
						this.$body.css( "overflow", "hidden" );
					}
				} );
		}

		this.bindEvents();
	}

	calcOriginTransformation ( $originElement ) {
		let scrollX = window.$( window ).scrollLeft(),
			scrollY = window.$( window ).scrollTop(),
			paddingTop = parseInt( $originElement.css( "padding-top" ) ),
			paddingLeft = parseInt( $originElement.css( "padding-left" ) ),
			x = $originElement.offset().left - scrollX - paddingLeft,
			y = $originElement.offset().top - scrollY - paddingTop,
			width = $originElement.width(),
			height = $originElement.height(),
			translate = "translate( " + x + "px, " + y + "px )",
			scale = "scale( " + width / window.$( window ).width() + ", " + height / window.$( window ).height() + " )";

		return translate + " " + scale;
	}

	hideOverlay () {
		this.$overlay.removeClass( this.classes.active );

		if ( this.settings.scaleFromOrigin && this.$originElement ) {
			let transformation = this.calcOriginTransformation( this.$originElement );

			this.$overlay
				.stop()
				.animate( {
					"transform": transformation
				}, this.settings.animationTime, (() => {
					if ( typeof this.settings.callbacks.onOverlayClosed === "function" ) {
						this.settings.callbacks.onOverlayClosed( this );
					}
				} ) );
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
		}

		return false;
	}

	closeBtnClicked ( event ) {
		let self = event.data || this;

		self.hideOverlay();
	}
}

module.exports = Overlay;
