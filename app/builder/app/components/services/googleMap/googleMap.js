//Service googleMap
var googleMap = angular.module("googleMapModule", []);
/*
Service to load google map and create a default map with default style
Methods

#Load the map and put it in the map_id element
#You can extend default map options by adding some google maps options in the map_options object
googleMap.loadDefaultMap(map_id,map_options).then(function(map){...},function(error){...});

#Load google map script and put it in the page 
googleMap.loadScriptMap().then(function(success){...},function(error){...});

============================================================
| To call after the map is loaded (loadDefaultMap)		   |
| or after a manual  initialisation (after loadScriptMap)  |
============================================================

#Add one marker to the map (or update its position)
#If center is set to true, the map is centered on the marker

googleMap.setOneMarker({"lat":..,"lng":...},center)

#Add one marker to the map and store it in an array (googleMap.markers) 
#If center is set to true, the map is centered on the marker
googleMap.addMarker({"lat":..,"lng":...},center)

#show all markers in googleMap.markers
googleMap.showMarkers()

#hide all markers
googleMap.clearMarkers()

#hide and delete the markers
googleMap.deleteMarkers()

*/
googleMap.service("googleMap", ['$http', '$q', '$window', '$document', '$timeout', function($http, $q, $window, $document, $timeout) {
    //googleMap Service
    var self = this;
    //
    self.markers = [];
    self.marker;
    self.map;

    self.customClick = function(element, action) {

        var holdStarter = null,
            triggered = false,
            holdDelay = 100,
            holdActive = false;

        //click action
        var handleAction = function(action, event, element) {
                if (action && typeof(action) == 'function' && !triggered) {
                    triggered = true;
                    action(event, element);
                    $timeout(function() {
                        triggered = false
                    }, holdDelay);
                }
            }
            //normal click
        google.maps.event.addListener(element, 'click', function(event) {
            handleAction(action, event, element);
        });
        //custm click for event
        google.maps.event.addListener(element, 'mousedown', function() {
            holdStarter = setTimeout(function() {
                holdStarter = null;
                holdActive = true;
                // begin hold-only operation here, if desired
            }, holdDelay);
        });
        google.maps.event.addListener(element, 'mouseup', function(event) {
            if (holdStarter) {
                clearTimeout(holdStarter);
                // run click-only operation here
                handleAction(action, event, element);
            }
            // Otherwise, if the mouse was being held, end the hold
            else if (holdActive) {
                holdActive = false;
                // end hold-only operation here, if desired
            }
        });
    }
    self.setZoom = function(zoomLevel) {
            if (!self.map)
                return false;
            self.map.setZoom(zoomLevel);
        }
        // Sets the map on all markers in the array.
    self.setAllMap = function(map) {
            if (!$window.google || !$window.google.maps || !self.map) {
                return false;
            }
            for (var i = 0; i < self.markers.length; i++) {
                self.markers[i].setMap(map);
            }
        }
        // Shows any markers currently in the array.
    self.showMarkers = function() {
        if (!$window.google || !$window.google.maps || !self.map) {
            return false;
        }
        self.setAllMap(self.map);
    };
    // Removes the markers from the map, but keeps them in the array.
    self.clearMarkers = function() {
        if (!$window.google || !$window.google.maps || !self.map) {
            return false;
        }
        self.setAllMap(null);
    };
    // Deletes all markers in the array by removing references to them.
    self.deleteMarkers = function() {
        if (!$window.google || !$window.google.maps || !self.map) {
            return false;
        }
        self.setAllMap(null);
        self.markers = [];
    };
    // Add a marker to the map and push to the array.
    self.addMarker = function(position, center, config, click_func) {
        if (!$window.google || !$window.google.maps || !self.map) {
            return false;
        }
        if (!config) {
            config = {};
        }
        var latLng = new google.maps.LatLng(position.lat || position.latitude, position.lng || position.longitude);

        config.position = latLng;
        config.map = self.map;

        var marker = new google.maps.Marker(config);

        if (center) {
            self.map.setCenter(latLng);
        }
        if (click_func && typeof(click_func) == "function") {
            self.customClick(marker, click_func);
        }
        self.markers.push(marker);

    };

    // Add or update the position of one unique marker
    self.setOneMarker = function(position, center, config, click_func) {
        if (!$window.google || !$window.google.maps || !self.map) {
            return false;
        }
        //$scope.$watch("AD",function(){
        var latLng = new google.maps.LatLng(position.lat || position.latitude, position.lng || position.longitude);
        if (!self.marker) {

            if (!config) {
                config = {};
            }
            config.position = latLng;
            config.map = self.map;
            config.zIndex = 11;

            self.marker = new google.maps.Marker(config);
            if (click_func && typeof(click_func) == "function") {
                self.customClick(marker, click_func);
            }
        } else {
            //just to be sure
            self.marker.setMap(self.map);
            self.marker.setPosition(latLng);
        }
        if (center) {
            self.map.setCenter(latLng);
        }
        return true;
    };
    //Load a default map with a default style
    self.loadDefaultMap = function(map_id, map_options) {
        if (!map_id) {
            map_id = "map";
        }
        var deferred = $q.defer();
        self.loadScriptMap().then(
            function(success) {
                //Brussels
                var styles = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2efea"},{"visibility":"on"}]},{"featureType":"landscape","elementType":"labels.text.fill","stylers":[{"color":"#3c3c3b"}]},{"featureType":"landscape.natural.terrain","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#8aacb6"},{"visibility":"on"}]}]

                // Create a new StyledMapType object, passing it the array of styles,
                // as well as the name to be displayed on the map type control.
                var styledMap = new google.maps.StyledMapType(styles, {
                    name: "Styled Map"
                });

                var mapOptions = {
                    //center: latlng,
                    zoom: 16,
                    mapTypeControlOptions: {
                        mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
                    },
                    disableDefaultUI: true,
                    zoomControl: true,
                    zoomControlOptions: {
                        style: google.maps.ZoomControlStyle.LARGE,
                        position: google.maps.ControlPosition.LEFT_CENTER
                    }
                };
                if (map_options) {
                    angular.extend(mapOptions, map_options);
                }
                self.map = new google.maps.Map(document.getElementById(map_id), mapOptions);
                self.map.mapTypes.set('map_style', styledMap);
                self.map.setMapTypeId('map_style');
                //Avoid well known top left corner issue
                google.maps.event.addListenerOnce(self.map, 'idle', function() {
                    google.maps.event.trigger(self.map, 'resize');
                });

                deferred.resolve(self.map);
            },
            function(fail) {
                console.log("FAIL:", fail);
                deferred.reject(fail);
            }
        );
        return deferred.promise;
    };
    /*
    Get a written address and return the correct address with geo lat
    */
    self.searchGeoCode = function(address) {
        var deferred = $q.defer();
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'address': address
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var location = results[0].geometry.location;
                var info = {};
                info.result = results[0];
                info.geo_lat = location.lat();
                info.geo_long = location.lng();
                deferred.resolve(info)
            } else {
                deferred.reject("Geocode was not successful for the following reason: " + status);
            }
        });
        return deferred.promise;
    };
    self.searchAddress=function(position){
        var latLng = new google.maps.LatLng(position.lat || position.latitude, position.lng || position.longitude);
        
        var deferred = $q.defer();
        var geocoder = new google.maps.Geocoder();
        
        geocoder.geocode({
            'location': latLng
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if(results[0]){
                    deferred.resolve(results[0])
                }
                else{
                    deferred.reject({
                        "success":false
                    })
                }
            } else {
                deferred.reject("Geocode was not successful for the following reason: " + status);
            }
        });
        return deferred.promise;
    }
    /*
	Load google map script
    */
    self.loadScriptMap = function(deferred) {
        if (!deferred || !deferred.promise)
            deferred = $q.defer();
        if (navigator.connection && window.Connection && navigator.connection.type === window.Connection.NONE) {
            if ($window.google && $window.google.maps) {
                deferred.resolve("google map is there");
            } else {
                deferred.reject("no connection (mobile)");
                $document.on("online", function(event) {
                    self.loadScriptMap(deferred);
                });
            }
        } else if ($window.google && $window.google.maps) {
            deferred.resolve("google map is already there");
        } else {
            var loaded = false;
            var load_script = function() {
                loaded = true;
                var s = document.createElement('script'); // use global document since Angular's $document is weak
                //s.src = 'https://maps.googleapis.com/maps/api/js?key='+config.app.googleApiKey+'&callback=initialize';
                s.src = 'https://maps.googleapis.com/maps/api/js?callback=initialize';

                document.body.appendChild(s);
            };
            $window.initialize = function() {
                deferred.resolve("google map is there");
            };
            if (document.readyState === "complete") {
                load_script();
            } else if ($window.attachEvent) {
                $window.attachEvent('onload', load_script);
            } else {
                $window.addEventListener('load', load_script, false);
            }
        }
        return deferred.promise;
    };

}]);
