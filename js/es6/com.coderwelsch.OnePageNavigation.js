class OnePageNavigation {
	constructor ( settings ) {
		this.settings = {
			selectors: {
				headerElement: ".header",
				navItems: "nav ul li",
				target: "data-target",
				sectionItems: "body section",
				sectionIdFilter: "[data-id='{{ID}}']",
				getSectionIdData: "data-id"
			},

			behaviour: {
				scrollAnimationDuration: 250,
				changeLocationHash: true,
				closeNavigationOnClick: true
			},

			classes: {
				active: "active"
			},

			callbacks: {
				sectionChanged: function ( $element ) {
					//
				},
				navElementClicked : function ( $element ) {
					//
				},
				customNavItemTargetData: function ( $element ) {
					return false;
				},
				customNavItemFilteringByCurrentSectionId: function ( sectionId, $navElements ) {
					return false;
				},
				customSectionFiltering: function ( target, $sectionElements ) {
					return false;
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
		this.$headerElement = window.$( this.selectors.headerElement );
		this.$navElements = window.$( this.selectors.navItems );
		this.$sectionItems = window.$( this.selectors.sectionItems );
		this.$currentVisibleSection = null;
		this.$activeNavElement = null;
		this.$window = window.$( window );
		this.$scrollElements = window.$( "html, body" );

		this.bindEvents();
	}

	navElementClicked ( event ) {
		let self = event.data,
			$this = window.$( this ),
			target = $this.attr( self.selectors.target ),
			$target;

		if ( typeof self.callbacks.customNavItemTargetData === "function" ) {
			target = self.callbacks.customNavItemTargetData( $this ) || target;
		}

		if ( typeof self.callbacks.customSectionFiltering === "function" ) {
			$target = self.callbacks.customSectionFiltering( target, self.$sectionItems );
		}

		$target = $target || self.$sectionItems.filter( self.selectors.sectionIdFilter.replace( "{{ID}}", target ) );

		if ( !$target || !$target.length ) {
			console.error( "Target section element '%s' to scroll to was not found!", target );

			return false;
		}

		if ( typeof self.callbacks.navElementClicked === "function" ) {
			self.callbacks.navElementClicked( $this );
		}

		self.$navElements.removeClass( self.classes.active );
		$this.addClass( self.classes.active );

		self.$scrollElements.animate( {
			scrollTop: $target.offset().top - ( self.$headerElement.height() )
		}, self.settings.behaviour.scrollAnimationDuration );
	}

	setNavItemOfVisibleSectionToActive () {
		let self = this,
			sectionId = this.$currentVisibleSection.attr( this.selectors.getSectionIdData ),
			$activeNavItem = null;

		if ( typeof this.callbacks.customNavItemFilteringByCurrentSectionId === "function" ) {
			$activeNavItem = this.callbacks.customNavItemFilteringByCurrentSectionId( sectionId, this.$navElements );
		} else {
			$activeNavItem = this.$navElements.filter( function () {
				return window.$( this ).attr( self.selectors.target ) === sectionId;
			} );
		}

		if ( this.$activeNavItem !== $activeNavItem && $activeNavItem ) {
			this.$navElements.removeClass( this.classes.active );
			this.$activeNavItem = $activeNavItem.addClass( this.classes.active );
		}
	}

	windowScrolled ( event ) {
		let self = event.data,
			scrollY = window.pageYOffset,
			viewportHeight = window.innerHeight,
			$currentSection = null,
			sectionHash;

		for ( let i = 0; i < self.$sectionItems.length; i++ ) {
			let $item = window.$( self.$sectionItems[ i ] ),
				offsetTop = $item.offset().top,
				sectionHeight = $item.height(),
				sectionFirstCondition = scrollY < viewportHeight / 2,
				sectionMiddleCondition = scrollY >= offsetTop - viewportHeight / 2 && scrollY < offsetTop + sectionHeight - viewportHeight / 2;

			if ( sectionFirstCondition || sectionMiddleCondition  ) {
				$currentSection = $item;
				break;
			}
		}

		if ( $currentSection !== null && self.$currentVisibleSection !== $currentSection ) {
			self.$currentVisibleSection = $currentSection;
			sectionHash = self.$currentVisibleSection.attr( self.selectors.getSectionIdData );
			self.setNavItemOfVisibleSectionToActive();

			if ( self.settings.behaviour.changeLocationHash && sectionHash ) {
				window.location.hash = sectionHash;
			}

			if ( typeof self.callbacks.sectionChanged === "function" ) {
				self.callbacks.sectionChanged( self.$currentVisibleSection );
			}
		}
	}

	bindEvents () {
		this.$navElements.on( "click", this, this.navElementClicked );
		this.$window.on( "scroll", this, this.windowScrolled );
	}
}

module.exports = OnePageNavigation;
