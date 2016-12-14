// imports
import WebStorage from "./com.coderwelsch.WebStorage.js";

export default class Banner {
	constructor ( settings ) {
		this.settings = {
			selectors: {
				container: ".banner",
				controlsContainer: ".controls",
				collapseBtn: ".show"
			},

			webStorageKeyName: "notification-state",

			classes: {
				active: "active"
			},

			callbacks: {
				onRestoredState: ( state ) => {
					//
				},
				onStateChanged: ( state ) => {
					//
				}
			}
		};

		// extend settings
		window.$.extend( true, this.settings, settings );

		// class variables
		this.selectors = this.settings.selectors;
		this.classes = this.settings.classes;
		this.callbacks = this.settings.callbacks;

		this.init();
	}

	init () {
		this.initVariables();
		this.restoreState();
		this.bindEvents();
	}

	restoreState () {
		let state = this.webStorageInstance.data( this.settings.webStorageKeyName );

		if ( state || state === null ) {
			this.$container.addClass( this.classes.active );
		} else {
			this.$container.removeClass( this.classes.active );
		}

		if ( typeof this.callbacks.onRestoredState === "function" ) {
			this.callbacks.onRestoredState( state );
		}
	}

	collapseBtnClicked ( event ) {
		let self = event.data;

		self.$container.toggleClass( self.classes.active );
		self.webStorageInstance.data( self.settings.webStorageKeyName, self.$container.hasClass( self.classes.active ) );

		if ( typeof self.callbacks.onRestoredState === "function" ) {
			self.callbacks.onRestoredState( self.webStorageInstance.data( self.settings.webStorageKeyName ) );
		}
	}

	bindEvents () {
		this.$controls.on( "click", this.selectors.collapseBtn, this, this.collapseBtnClicked );
	}

	initVariables () {
		this.webStorageInstance = new WebStorage();
		this.$container = window.$( this.selectors.container );
		this.$controls = this.$container.find( this.selectors.controlsContainer );
	}
}
