class FilterModule {
	constructor ( settings ) {
		this.settings = {
			selectors: {
				container: ".filter-module",
				headerItems: ".filter-header li",
				filterItems: ".items .item"
			},

			classes: {
				active: "active"
			},

			behaviour: {
				showAllEntriesOnStart: true
			},

			callbacks: {
				filterChanged: function ( event, element ) {

				}
			}
		};

		// extend settings
		window.$.extend( true, this.settings, settings );

		// public variables
		this.selectors = this.settings.selectors;
		this.classes = this.settings.classes;
		this.callbacks = this.settings.callbacks;

		// plugin variables
		this.$container = window.$( this.selectors.container );
		this.$headerItems = this.$container.find( this.selectors.headerItems );
		this.$filterItems = this.$container.find( this.selectors.filterItems );

		this.$currentHeaderElement = null;

		this.bindEvents();

		if ( this.settings.behaviour.showAllEntriesOnStart ) {
			this.showAllElements();
		}
	}

	bindEvents () {
		this.$headerItems.on( "click", this, this.headerItemClicked );
	}

	showAllElements () {
		this.$filterItems.addClass( this.classes.active );
	}

	headerItemClicked ( event ) {
		let self = event.data,
			$this = $( this ),
			headerFilterTag = $this.data( "filter" );

		if ( self.$currentHeaderElement === $this ) {
			return false;
		}

		self.$headerItems.removeClass( self.classes.active );
		self.$currentHeaderElement = $this.addClass( self.classes.active );

		self.$filterItems
			.removeClass( self.classes.active )
			.filter( function () {
				var $this = $( this ),
					filterTags = ( $this.data( "tags" ) || "" ).replace( " ", "" ).split( "," );

				for ( var i = 0; i < filterTags.length; i++ ) {
					if ( filterTags[ i ] === headerFilterTag || !headerFilterTag ) {
						return true;
					}
				}

				return false;
			} ).addClass( self.classes.active );
	}
}

module.exports = FilterModule;
