var com = com || {};
com.cw = com.cw || {};

com.cw.TabRegister = function ( settings ) {
    'use strict';

    // global variables
    var that = this;

    // settings
    this.settings = {
        $container: $( '.tab-register' ).first()
    };

    $.extend( this.settings, settings );

    this.init = function () {
        this.initVariables();
        this.bindEvents();
    };

    this.initVariables = function () {
        this.$header = this.settings.$container.find( '.header' );
        this.$headerTabs = this.$header.find( 'li' );
        this.$content = this.settings.$container.find( '.content' );
        this.$contentTabs = this.$content.find( '> div' );
    };

    this.bindEvents = function () {
        this.$headerTabs.on( 'click', this.headerTabClicked );
    };

    this.headerTabClicked = function () {
        var $this = $( this ),
            targetContentSelector = $this.attr( 'data-target' ),
            $targetContent = that.$contentTabs.filter( '.' + targetContentSelector );

        that.$headerTabs.removeClass( 'active' );
        $this.addClass( 'active' );

        that.$contentTabs.removeClass( 'active' );
        $targetContent.addClass( 'active' );

        console.log( targetContentSelector, $targetContent );
    };

    this.init();
};