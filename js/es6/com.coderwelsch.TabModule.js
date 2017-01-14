export default class Tabs {
	constructor ( settings ) {
		this.settings = {
			selectors: {
				container: ".tab-module",
				headerItems: ".header .item",
				tabItems: ".tabs .tab"
			},

			classes: {
				active: "active"
			},

			callbacks: {
				tabChanged: function ( event, element ) {
					//
				}
			}
		};

		// extend settings
		window.$.extend( true, this.settings, settings );

		// public variables
		this.selectors = this.settings.selectors;
		this.classes = this.settings.classes;

		// plugin variables
		this.$container = window.$( this.selectors.container );
		this.$headerItems = this.$container.find( this.selectors.headerItems );
		this.$tabItems = this.$container.find( this.selectors.tabItems );

		this.$currentHeaderElement = null;

		this.bindEvents();
	}

	bindEvents () {
		this.$headerItems.on( "click", this, this.headerItemClicked );
	}

	headerItemClicked ( event ) {
		let self = event.data,
			tabItemFilter;

		if ( self.$currentHeaderElement !== this ) {
			self.$currentHeaderElement = window.$( this );
		} else {
			return false;
		}

		tabItemFilter = "[data-id='" + self.$currentHeaderElement.data( "target" ) + "']";

		self.$headerItems.removeClass( self.classes.active );
		self.$currentHeaderElement.addClass( self.classes.active );
		self.$tabItems
			.removeClass( self.classes.active )
			.filter( tabItemFilter ).addClass( self.classes.active );

		self.settings.callbacks.tabChanged( event, this );
	}
}
