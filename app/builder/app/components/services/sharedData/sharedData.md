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