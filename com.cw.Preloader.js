/* global */

var com = com || {};
com.cw = com.cw || {};

com.cw.Preloader = function ( settings ) {
    'use strict';

    // global variables
    var that        = this,
        imgsToLoad  = 0,
        imgsLoaded  = 0,
        imgsError   = 0;

    // settings
    this.settings = {
        imageSources: [],
        autoLoad: true,
        noCache: false,
        onProgress: function () {},
        onLoaded: function () {}
    };

    $.extend( this.settings, settings );

    this.preload = function () {
        imgsToLoad = this.settings.imageSources.length;
        imgsLoaded = 0;
        imgsError = 0;

        if ( this.settings.imageSources.length !== 0 ) {
            for ( var i = 0; i < this.settings.imageSources.length; i++ ) {
                this.applyImgEvents( i, this.settings.imageSources[ i ] );
            }
        } else {
            console.warn( 'CW Preloader: No Images found!' );
        }
    };

    this.applyImgEvents = function ( index, src ) {
        var image = new Image();

        image.onload = function () {
            imgsLoaded++;

            that.fileLoaded( imgsLoaded, imgsToLoad, imgsError );
        };

        image.onerror = function () {
            imgsError++;

            that.fileLoaded( imgsLoaded, imgsToLoad, imgsError );
        };

        if ( this.settings.noCache ) {
            image.src = src + '?' + Math.random();
        } else {
            image.src = src;
        }
    };

    this.fileLoaded = function ( imgsLoaded, imgsToLoad, imgsError ) {
        this.settings.onProgress( imgsLoaded, imgsToLoad, imgsError );

        if ( imgsLoaded + imgsError === imgsToLoad ) {
            this.settings.onLoaded( imgsLoaded, imgsToLoad, imgsError );
        }
    };

    if ( this.settings.autoLoad ) {
        this.preload();
    }
};