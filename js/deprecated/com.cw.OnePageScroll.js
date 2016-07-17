var com = com || {};
com.cw = com.cw || {};

com.cw.OnePageScroll = function ( settings ) {
    'use strict';

    // settings
    this.settings = {
        $scrollContainer: $( window ),
        $navContainer: $( document ),
        $siteContainer: $( document ),
        isContentOnePage: false,
        onePageOffset: -1,
        activeClass: 'active',
        navItemSelector: 'li',
        dataReferenceNavItemSelector: 'href',
        pageSelectorIsLowerCase: true,
        dataNavItemContentSelector: 'a',
        siteSelector: '.wrapper',
        switchPageOffset: 0.5,
        ignoreElements: undefined,

        onPageSwitch: function ( $currentPage, $lastPage ) {}
    };

    $.extend( this.settings, settings );

    var _that,
        _settings,
        _$lastActiveNavItem,
        _$currentActiveSite;

    this.bindEvents = function (){
        _settings.$scrollContainer.scroll( this.containerScrolled );

        _that.$navItems.on( 'click', this.navItemClicked );
        _settings.$siteContainer.on( 'resize', this.resize );
    };

    this.navItemClicked = function ( event ) {
        var hash = $( event.currentTarget ).attr( _settings.dataReferenceNavItemSelector );
        var editedHash = _settings.pageSelectorIsLowerCase ? hash.toLowerCase() : hash;

        window.location.hash = editedHash;

        _settings.$navContainer.scrollTop( $( editedHash ).offset().top );
    };

    this.containerScrolled = function ( event ) {
        if ( _settings.isContentOnePage ) {
            var scrollPos = _settings.$siteContainer.scrollTop();

            _that.$sites.each( function () {
                var sitePos = $( this ).offset().top;
                var siteHeight = $( this ).height();

                if ( scrollPos === sitePos - siteHeight + _settings.onePageOffset ) {
                    //console.log( $( this ).attr( 'id' ) );

                    return false;
                }

                // console.log( scrollPos, sitePos, sitePos - siteHeight + _settings.onePageOffset);
            } );
        } else {
            // TODO:
        }
    };

    this.resize = function ( event ) {
        var height = 0;

        _that.$sites.each( function () {
            height += $( this ).height();
        } );

        _that.pageContainerHeight = height;
    };

    this.initVariables = function () {
        _that = this;
        _settings = this.settings;

        this.$navItems = _settings.$navContainer.find( _settings.navItemSelector );
        this.$sites = _settings.$siteContainer.find( _settings.siteSelector );
        this.pageContainerHeight = 0;

        this.resize();
    };

    this.init = function () {
        this.initVariables();
        this.bindEvents();
    };

    this.init();
};