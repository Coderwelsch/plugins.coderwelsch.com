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

		console.log( state );
	}

	collapseBtnClicked ( event ) {
		let self = event.data;

		self.$container.toggleClass( self.classes.active );
		self.webStorageInstance.data( self.settings.webStorageKeyName, self.$container.hasClass( self.classes.active ) );
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
