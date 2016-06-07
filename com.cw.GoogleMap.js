/* global */

var com = com || {};
com.cw = com.cw || {};

com.cw.GoogleMap = function ( settings ) {
    'use strict';

    // settings
    this.settings = {
        $container: $( document ),

        mapSettings: {
            zoom: 8,
            center: { lat: 51.165691, lng: 10.451526 },
            styles: {}
        },

        apiURL: '//maps.googleapis.com/maps/api/js?',
        apiVersion: undefined,
        apiKey: undefined,

        onMapLoaded: function () {

        }
    };

    $.extend( true, this.settings, settings );

    var that = this;

    this.initGoogleMaps = function () {
        this.googleMap = new google.maps.Map( this.settings.$container[ 0 ], this.settings.mapSettings );

        this.settings.onMapLoaded( this.googleMap );
    };

    this.addMarker = function ( settings ) {
        var tmpSettings = {
                map: this.googleMap,
                infoWindowHtml: "",
                toggleInfoWindow: false
            },
            marker = null,
            infoWindow = null;

        $.extend( true, tmpSettings, settings );

        marker = new google.maps.Marker( tmpSettings );

        if ( tmpSettings.toggleInfoWindow ) {
            infoWindow = new google.maps.InfoWindow( {
                content: tmpSettings.infoWindowHtml || ""
            } );

            marker.addListener( 'click', function () {
                if ( infoWindow.isOpened ) {
                    infoWindow.isOpened = false;
                    infoWindow.open( null, null );
                } else {
                    infoWindow.open( tmpSettings.map, this );
                    infoWindow.isOpened = true;
                }
            } );
        }

        return marker;
    };

    this.googleMapsLoaded = function () {
        google.maps.event.addDomListener( window, "load", this.initGoogleMaps() );
    };

    this.loadGoogleMaps = function () {
        if ( !( 'google' in window ) ) {
            var url = this.settings.apiURL;

            if ( this.settings.apiVersion ) {
                url += 'v=' + this.settings.apiVersion + '&';
            }

            if ( this.settings.apiKey ) {
                url += 'key=' + this.settings.apiKey + '&';
            }

            url += 'callback=gMapLoaded';

            $( '<script></script>' )
                .attr( 'src', url )
                .appendTo( document.head );

            window.gMapLoaded = function () {
                that.googleMapsLoaded();
            };
        } else {
            this.googleMapsLoaded();
        }
    };

    if ( document.readyState === 'complete' ) {
    	this.loadGoogleMaps();
    } else {
        $( document).on( 'ready', function () {
            that.loadGoogleMaps();
        } );
    }
};

module.exports = com.cw.GoogleMap;
