##Small description

Service to load google map and create a default map with default style
Methods

##API Doc

###loadDefaultMap

Load the map and put it in the map_id element
You can extend default map options by adding some google maps options in the map_options object

```
googleMap.loadDefaultMap(map_id,map_options).then(
	function(map){...},
	function(error){...}
);
```

###loadScriptMap

Load google map script and put it in the page 

```
googleMap.loadScriptMap().then(function(success){...},function(error){...});
```

*To call after the map is loaded (loadDefaultMap) or after a manual  initialisation (after loadScriptMap)* 

###setOneMarker

Add one marker to the map (or update its position).
If center is set to true, the map is centered on the marker

```
googleMap.setOneMarker({"lat":..,"lng":...},center)
```

###addMarker

Add one marker to the map and store it in an array (googleMap.markers) 
If center is set to true, the map is centered on the marker

```
googleMap.addMarker({"lat":..,"lng":...},center)
```

###showMarkers

show all markers in googleMap.markers

```
googleMap.showMarkers()
```

###clearMarkers

hide all markers

```
googleMap.clearMarkers()
```

###deleteMarkers

hide and delete the markers

```
googleMap.deleteMarkers()
```
