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
				html = this.callbacks.onImageWantsToOpen( image );

			this.overlayInstance.showOverlay( html, new $( image ) );
			this.$navPrev = this.overlayInstance.$overlay.find( this.selectors.navPrevios );
			this.$navNext = this.overlayInstance.$overlay.find( this.selectors.navNext );

			this.$navPrev.on( "click", () => {
				// TODO:
				console.log( "PREV" );
			} );

			this.$navNext.on( "click", () => {
				// TODO:
				console.log( "NEXT" );
			} );
		} );
	}
}