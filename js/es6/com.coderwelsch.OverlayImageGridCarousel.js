import Utils from "./com.coderwelsch.Utils.js";
import $ from "./com.coderwelsch.Query.js";
import Overlay from "./com.coderwelsch.Overlay.js";


export default class OverlayImageGridCarousel {
	constructor ( settings ) {
		this.settings = {
			selectors: {
				carouselContainer: ".carousel",
				imageElement: ".image",
				navPrevios: ".prev",
				navNext: ".next"
			},

			overlayInstance: null,

			behaviour: {
				isCarousel: true,
				useKeyboardControl: true
			},

			callbacks: {
				onOverlayOpen: ( instance ) => {
					// called on the show-overlay-event
				},
				onImageWantsToOpen: ( imageElement ) => {
					// should return a html string for the Overlay instance to display
				}
			}
		};

		// extend settings
		this.settings = Utils.extend( true, this.settings, settings );

		// class variables
		this.selectors = this.settings.selectors;
		this.callbacks = this.settings.callbacks;

		// properties
		this.overlayInstance = this.settings.overlayInstance;

		this.$container = new $( this.selectors.carouselContainer );
		this.$images = this.$container.find( this.selectors.imageElement );
		this.$navPrev = null;
		this.$navNext = null;

		this.init();
		this.bindEvents();
	}

	init () {
		if ( this.overlayInstance === null ) {
			this.overlayInstance = new Overlay( {
				appendOverlayIfNotFound: true
			} );
		}
	}

	bindEvents () {
		this.$images.on( "click", ( event ) => {
			let image = event.currentTarget,
				$img = new $( image ),
				html = this.callbacks.onImageWantsToOpen( image );

			this.overlayInstance.showOverlay( html, $img, !this.overlayInstance.isActive() );
			this.$navPrev = this.overlayInstance.$overlay.find( this.selectors.navPrevios );
			this.$navNext = this.overlayInstance.$overlay.find( this.selectors.navNext );

			new $( document.body ).on( "keyup", ( event ) => {
				if ( event.keyCode === 37 ) { // arrow left
					let $prevImg = $img.prev();
					$prevImg.trigger( "click" );
				} else if ( event.keyCode === 39 ) { // arrow right
					let $nextImg = $img.next();
					$nextImg.trigger( "click" );
				} else {
					// TODO: REMOVE EVENT LISTENERS
				}
			} );

			this.$navPrev.one( "click", () => {
				let $prevImg = $img.prev();
				$prevImg.trigger( "click" );
			} );

			this.$navNext.one( "click", () => {
				let $nextImg = $img.next();
				$nextImg.trigger( "click" );
			} );
		} );
	}
}
