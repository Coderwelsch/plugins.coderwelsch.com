class GoogleMaps {
    constructor ( settings ) {
        this.settings = {
            selectors: {
                mapContainer: '#map-container',
                map: '.map',
                lockMapOverlay: '.lock-overlay'
            },

            classes: {
                active: 'active',
                mapLockOverlay: 'lock-overlay',
                mapUnlocked: 'unlocked'
            },

            accessToken: '',

            centerMarkerSettings: {
                enabled: true,
                isOpened: true,
                markerTitle: '',
                infoWindowText: ''
            },

            mapSettings: {
                center: { lat: 52, lng: 9 },
                zoom: 8
            },

            uxSettings: {
                lockMap: true,
                lockOnlyOnTouch: true
            },

            callbacks: {
                onMapReady: function () {
                    // fired when the google maps plugin was loaded and map is
                    // initialized
                },

                onMapLockChange: function ( isUnlocked ) {
                    // fired when uxSettings.lockMap ist active and the user
                    // unlocked or locked the map
                }
            }
        };

        // extend settings
        $.extend( true, this.settings, settings );

        // class variables
        this.selectors = this.settings.selectors;
        this.classes = this.settings.classes;
        this.mapSettings = this.settings.mapSettings;
        this.callbacks = this.settings.callbacks;

        // url of the latest google maps plugin with authentification
        this.restApiUrl = 'https://maps.googleapis.com/maps/api/js?key={{API_KEY}}&callback={{CALLBACK}}';

        // plugin variables
        this.map = null;

        this.$mapContainer = $( this.selectors.mapContainer );
        this.$map = this.$mapContainer.find( this.selectors.map );
        this.$lockOverlay = null;

        if ( window.google && window.google.maps ) {
            // if google maps already loaded
            this.initMap();
        } else {
            // load google maps plugin
            this.loadGoogleMapsApi();
        }
    }

    initLockOverlay () {
        this.$lockOverlay = this.$mapContainer.find( this.selectors.lockMapOverlay );

        // create lock overlay if google maps removed this from the container
        if ( !this.$lockOverlay.length ) {
            this.$lockOverlay = $( '<div></div>' ).appendTo( this.$mapContainer );
        }

        this.$lockOverlay.addClass( this.classes.mapLockOverlay );

        // if map is locked via default
        if ( this.settings.uxSettings.lockOnlyOnTouch && 'ontouchstart' in window ) {
            this.lockMap();
        } else {
            this.unlockMap();
        }

        this.$lockOverlay.on( 'click', this, this.changeMapLock );
    }

    initMap () {
        // instanciate google map
        this.map = new google.maps.Map( this.$map[ 0 ], this.mapSettings );

        // add the optional center marker
        if ( this.settings.centerMarkerSettings.enabled ) {
            this.centerMarker = this.addMarker( this.mapSettings.center, this.settings.centerMarkerSettings.markerTitle, this.settings.centerMarkerSettings.infoWindowText, this.settings.centerMarkerSettings.isOpened );
        }

        // lock map
        if ( this.settings.uxSettings.lockMap ) {
            this.initLockOverlay();
        }

        // fires map ready callback
        if ( typeof this.callbacks.onMapReady === 'function' ) {
            this.callbacks.onMapReady();
        }
    }

    loadGoogleMapsApi () {
        let self = this,
            url = this.restApiUrl
                    .replace( '{{API_KEY}}', this.settings.accessToken )
                    .replace( '{{CALLBACK}}', 'cwGoogleApiCallback' );

        // google maps plugin loading callback workaround
        window.cwGoogleApiCallback = window.cwGoogleApiCallback || function () {
            self.initMap();
        };

        // add google maps plugin script tag to document's head
        $( '<script src="' + url + '"></script>' ).appendTo( document.head );
    }

    changeMapLock ( event ) {
        let self = event ? event.data : this;

        self.$lockOverlay.toggleClass( self.classes.mapUnlocked );
    }

    unlockMap () {
        this.$lockOverlay.addClass( this.classes.mapUnlocked );
    }

    lockMap () {
        this.$lockOverlay.removeClass( this.classes.mapUnlocked );
    }

    addMarker ( latLng, title, infoWindowText, isOpened ) {
        let self = this,
            marker = new google.maps.Marker( {
                position: latLng,
                map: this.map,
                title: title
            } ),
            infoWindow = null;

        // add infowindow functionality only if a text is defined
        if ( infoWindowText ) {
            infoWindow = new google.maps.InfoWindow( { content: infoWindowText } );

            // listen to click events
            marker.addListener( 'click', function () {
                infoWindow.open( self.map, marker );
            } );

            // if the infowindow should be opened at creation...
            if ( isOpened ) {
                infoWindow.open( self.map, marker );
            }
        }

        return marker;
    }
}

module.exports = GoogleMaps;
