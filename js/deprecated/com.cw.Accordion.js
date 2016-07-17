var com = com || {};
com.cw = com.cw || {};

com.cw.Accordion = function ( settings ) {
    'use strict';

    // global variables
    var that = this;

    // settings
    this.settings = {
        $container: $(),
        selectors: {
            tabContainer: '.tab',
            tabHeader: '.header',
            tabBody: '.body'
        },
        targetDataAttr: 'data-target',
        activeClass: 'active',
        slideDelay: 300,
        multiActiveTabs: false,
        events: {
            onTabOpen: null,
            onTabClose: null,
            onAllTabsClose: null
        }
    };

    $.extend( this.settings, settings );

    // main functions
    this.init = function () {
        this.initVariables();
        this.bindEvents();
    };

    this.bindEvents = function () {
        this.$headers.on( 'click', this.headerClicked );
    };

    this.initVariables = function () {
        this.$container = this.settings.$container;
        this.$tabs = this.$container.find( this.settings.selectors.tabContainer );
        this.$headers = this.$container.find( this.settings.selectors.tabHeader );
        this.$bodys = this.$container.find( this.settings.selectors.tabBody );
    };

    this.closeAllTabs = function () {
        this.$tabs.removeClass( this.settings.activeClass );
        this.$bodys.slideUp( this.settings.slideDelay );
    };

    this.openTab = function ( $tab ) {
        var $tabBody = $tab.find( this.settings.selectors.tabBody )
                            .slideDown( that.settings.slideDelay );

        $tab.addClass( this.settings.activeClass );

        if ( this.settings.events.onTabOpen !== null ) {
            this.settings.events.onTabOpen( $tab );
        }
    };

    this.closeTab = function ( $tab ) {
        var $tabBody = $tab.find( this.settings.selectors.tabBody )
                            .slideUp( that.settings.slideDelay );

        $tab.removeClass( this.settings.activeClass );

        if ( this.settings.events.onTabClose !== null ) {
            this.settings.events.onTabClose( $tab );
        }
    };

    this.openTabByIndex = function ( index ) {
        var $tab = this.$tabs.eq( index );

        if ( $tab.length ) {
            this.openTab( $tab );

            return true;
        }

        return false;
    };

    this.headerClicked = function ( event ) {
        var $this = $( this ),
            $tab = $this.parent();

        if ( $tab.hasClass( that.settings.activeClass ) ) {
            if ( that.settings.multiActiveTabs ) {
                that.closeTab( $tab );
            } else {
                that.closeAllTabs();
            }

            return;
        } else {
            if ( !that.settings.multiActiveTabs ) {
                that.closeAllTabs();
            }

            that.openTab( $tab );
        }
    };


    // init
    this.init();
};
