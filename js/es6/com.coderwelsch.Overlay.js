class Overlay {
	constructor ( settings ) {
		this.settings = {
			autoFindImgs: true,
			autoProgressHandling: false,
			autoSetImageSrc: true,
			scaleFromOrigin: true,
			animationTime: 250,
			lockBodyOnShow: true,

			selectors: {
				overlay: "#overlay",
				close: ".close",
				content: ".content"
			},

			classes: {
				active: "active"
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

		this.bindEvents();
	}

	bindEvents () {
		this.$closeBtn.on( "click", this, this.closeBtnClicked );
		window.$( document ).on( "keydown", this, this.keyPressed );
	}

	showOverlay ( html = "", $originElement = "" ) {
		this.$content.html( html );
		this.$overlay.addClass( this.classes.active );

		if ( this.settings.lockBodyOnShow ) {
			this.$body.css( "overflow", "hidden" );
		}

		if ( $originElement ) {
			let transformation = this.calcOriginTransformation( $originElement );

			this.$originElement = $originElement;
			this.$overlay
				.css( {
					transform: transformation
				} )
				.animate( {
					transform: "translate( 0, 0 ), scale( 1, 1 )"
				}, this.settings.animationTime );
		}
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

			this.$overlay.animate( {
				transform: transformation
			}, this.settings.animationTime );
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
	}

	closeBtnClicked ( event ) {
		let self = event.data || this;

		self.hideOverlay();
	}
}

module.exports = Overlay;
