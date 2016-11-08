export default class Accordion {
	constructor ( settings ) {
		this.settings = {
			selectors: {
				tabContainer: ".tab",
				tabHeader: ".header",
				tabBody: ".body"
			},

			targetDataAttr: "data-target",
			activeClass: "active",
			slideDelay: 300,
			multiActiveTabs: false,
			callbacks: {
				onTabOpen: null,
				onTabClose: null,
				onAllTabsClose: null
			}
		};

		// extend settings
		window.$.extend( true, this.settings, settings );

		// class variables
		this.selectors = this.settings.selectors;
		this.callbacks = this.settings.callbacks;

		this.init();
	}

	init () {
		this.initVariables();
		this.bindEvents();
	}

	bindEvents () {
		this.$headers.on( "click", this, this.headerClicked );
	}

	initVariables () {
		this.$container = this.settings.$container;
		this.$tabs = this.$container.find( this.settings.selectors.tabContainer );
		this.$headers = this.$container.find( this.settings.selectors.tabHeader );
		this.$bodys = this.$container.find( this.settings.selectors.tabBody );
	}

	closeAllTabs () {
		this.$tabs.removeClass( this.settings.activeClass );
		this.$bodys.slideUp( this.settings.slideDelay );
	}

	openTab ( $tab ) {
		$tab
			.find( this.settings.selectors.tabBody )
			.slideDown( this.settings.slideDelay );

		$tab.addClass( this.settings.activeClass );

		if ( typeof this.settings.callbacks.onTabOpen === "function" ) {
			this.settings.callbacks.onTabOpen( $tab );
		}
	}

	closeTab ( $tab ) {
		$tab
			.find( this.settings.selectors.tabBody )
			.slideUp( this.settings.slideDelay );

		$tab.removeClass( this.settings.activeClass );

		if ( this.settings.callbacks.onTabClose !== null ) {
			this.settings.callbacks.onTabClose( $tab );
		}
	}

	openTabByIndex ( index ) {
		var $tab = this.$tabs.eq( index );

		if ( $tab.length ) {
			this.openTab( $tab );

			return true;
		}

		return false;
	}

	headerClicked ( event ) {
		var self = event.data,
			$this = window.$( this ),
			$tab = $this.parent();

		if ( $tab.hasClass( self.settings.activeClass ) ) {
			if ( self.settings.multiActiveTabs ) {
				self.closeTab( $tab );
			} else {
				self.closeAllTabs();
			}

			return;
		} else {
			if ( !self.settings.multiActiveTabs ) {
				self.closeAllTabs();
			}

			self.openTab( $tab );
		}
	}
}
