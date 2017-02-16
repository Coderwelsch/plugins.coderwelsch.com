// imports
import $ from "./com.coderwelsch.Query.js";
import Utils from "./com.coderwelsch.Utils.js";
import WebStorage from "./com.coderwelsch.WebStorage.js";

export default class Banner {
	constructor ( settings ) {
		this.settings = {
			webStorageKeyName: "notification-state",

			selectors: {
				container: ".banner",
				controlsContainer: ".controls",
				collapseBtn: ".show"
			},

			classes: {
				active: "active"
			},

			callbacks: {
				onBeforeOpenBanner: () => {
					// true: open this banner
					// false: dont open this banner
					return true;
				},

				onRestoredState: ( state ) => {
					//
				},
				onStateChanged: ( state ) => {
					//
				}
			}
		};

		// extend settings
		this.settings = Utils.extend( true, this.settings, settings );

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

		if ( typeof this.callbacks.onStateChanged === "function" ) {
			this.callbacks.onStateChanged( state );
		}
	}

	collapseBtnClicked ( event ) {
		let self = event.data;

		// call onBeforeOpenBanner and stop on return value "false"
		if ( typeof self.callbacks.onBeforeOpenBanner === "function" ) {
			let returnValue = self.callbacks.onBeforeOpenBanner();

			if ( !returnValue ) {
				return;
			}
		}

		self.$container.toggleClass( self.classes.active );
		self.webStorageInstance.data( self.settings.webStorageKeyName, self.$container.hasClass( self.classes.active ) );

		if ( typeof self.callbacks.onRestoredState === "function" ) {
			self.callbacks.onRestoredState( self.webStorageInstance.data( self.settings.webStorageKeyName ) );
		}

		if ( typeof self.callbacks.onStateChanged === "function" ) {
			self.callbacks.onStateChanged( self.webStorageInstance.data( self.settings.webStorageKeyName ) );
		}
	}

	closeBanner () {
		this.$container.removeClass( this.classes.active );
	}

	openBanner () {
		this.$container.addClass( this.classes.active );
	}

	bindEvents () {
		this.$collapseBtn.on( "click", this, this.collapseBtnClicked );
	}

	initVariables () {
		this.webStorageInstance = new WebStorage();
		this.$container = new $( this.selectors.container );
		this.$controls = this.$container.find( this.selectors.controlsContainer );
		this.$collapseBtn = this.$controls.find( this.selectors.collapseBtn );
	}
}
