/* global */

var com = com || {};
com.cw = com.cw || {};

com.cw.ImageStack = function ( settings ) {
    'use strict';

    // settings
    this.settings = {
        $container: $( document ),
        showAllImages: true,
        imagesToShow: 3, // images shown simultaneously
        maxAngle: 10, // degrees
        minWidth: 60, // percent
        maxWidth: 70 // percent
    };

    $.extend( this.settings, settings );

    // private variables
    var that = this;
    var heightOfContainer = 0;
    var containerOffsetTop = 0;

    // public variables
    this.$imgContainer = this.settings.$container.find( '.stack-content' );
    this.$images = this.$imgContainer.find( 'img' );
    this.$controls = this.settings.$container.find( '.controls' );
    this.$LeftBtn = this.$controls.find( '.left' );
    this.$rightBtn = this.$controls.find( '.right' );

    this.init = function () {
        if ( this.settings.showAllImages ) {
            this.$images.each( this.showImage );
        }

        this.setContentHeight();
    };

    this.bindEvents = function () {
        this.$controls.on( 'click', '.left, .right', this.controlsClicked );
    };

    this.controlsClicked = function ( event ) {
        if ( $( event.currentTarget ).hasClass( 'right' ) ) { // is right btn
            that.nextImage();
        } else { // is left btn
            that.prevImage();
        }
    };

    this.nextImage = function () {
        that.$imgContainer.find( 'img:first-child' ).before( that.$imgContainer.find( 'img:last-child' ) );
    };

    this.prevImage = function () {
        that.$imgContainer.find( 'img:last-child' ).after( that.$imgContainer.find( 'img:first-child' ) );
    };

    this.setContentHeight = function () {
        // reset for new height
        heightOfContainer = 0;
        containerOffsetTop = 0;

        this.$images.each( function ( index, value ) {
            var $image = $( value ),
                height = $image[ 0 ].getBoundingClientRect().height;

            heightOfContainer = heightOfContainer < height ? height : heightOfContainer;

            containerOffsetTop = containerOffsetTop < height - $image.height() ? height - $image.height() : containerOffsetTop;
        } );

        containerOffsetTop /= 2;

        this.$imgContainer.height( heightOfContainer );
        this.settings.$container.css( 'padding-top', containerOffsetTop + 'px' );
    };

    this.generateRandomStylingForImage = function ( $image ) {
        var width = this.settings.minWidth + ( 100 - this.settings.minWidth ) * Math.random();
        width = width < this.settings.minWidth ? this.settings.minWidth : width;
        width = width > this.settings.maxWidth ? this.settings.maxWidth : width;

        var angle = Math.random() * this.settings.maxAngle;
        angle = angle > this.settings.maxAngle / 2 ? -angle : angle; // rotate left or right

        $image.css( {
            transform: 'rotateZ(' + angle + 'deg)',
            width: width + '%',
            marginLeft: ( -width / 2 ) + '%'
        } );
    };

    this.showImage = function ( index, value ) {
        $( value ).addClass( 'active' );

        that.generateRandomStylingForImage( $( value ) );
    };

    this.init();
    this.bindEvents();
};