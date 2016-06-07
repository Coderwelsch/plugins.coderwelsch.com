/* global $ */

var com = com || {};
com.cw = com.cw || {};

com.cw.FullscreenSlideshow = function ( settings ) {
    'use strict';

    // settings
    this.settings = {
        useDataAttributes: false,
        $container: null,
        useArrowNavigation: false,
        usePageNavigation: false,
        slideInterval: 5000,
        transitionTime: 1000,
        effect: 'fade-in',
        dirPath: '',
        fileExtension: ''
    };

    $.extend( this.settings, settings );

    // public properties
    this.position = 0;
    this.interval = 0;
    this.dirPath = this.settings.dirPath !== '' ? this.settings.dirPath : this.settings.$container.attr( 'data-dir-path' );
    this.fileExtension = this.settings.fileExtension !== '' ? this.settings.fileExtension : this.settings.$container.attr( 'data-extension' );

    this.$images = this.settings.$container.find( 'li' );

    // navigation
    this.$prevBtn = $( '<div class="prev-btn"></div>' );
    this.$nextBtn = $( '<div class="next-btn"></div>' );

    this.$pageNav = $( '<ul class="page-nav"></ul>' );

    // private properties
    var that = this;

    this.nextImage = function () {
        if ( that.position === that.$images.length - 1 ) {
            that.$images.eq( that.position ).removeClass( 'active' );
            that.$images.eq( 0 ).addClass( 'active' );

            that.position = 0;
        } else {
            that.$images.eq( that.position ).removeClass( 'active' );
            that.$images.eq( that.position + 1 ).addClass( 'active' );

            that.position++;
        }
    };

    this.previousImage = function () {

    };

    this.startSlideshow = function () {
        this.interval = setInterval( this.nextImage, this.settings.slideInterval );
    };

    this.stopSlideShow = function () {
        clearInterval( this.interval );
    };

    this.initDom = function () {
        this.$images.first().addClass( 'active' );
        this.$images.each( function () {
            $( this )
                .addClass( that.settings.effect )
                .css( {
                    'background-image': 'url(' + that.dirPath + $( this ).attr( 'data-name' ) + '.' + that.fileExtension + ')',
                    'transition': 'all ' + that.settings.transitionTime + 'ms linear'
                } );
        } );

        if ( this.settings.useArrowNavigation ) {
            this.settings.$container
                .prepend( this.$prevBtn )
                .append( this.$nextBtn );
        }

        if ( this.settings.usePageNavigation ) {
            this.settings.$container.append( this.$pageNav );
        }
    };

    this.initDom();
    this.startSlideshow();
};