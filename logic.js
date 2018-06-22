// Creating map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 3
});

// Adding tile layer
var outdoorsmap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		accessToken: 'pk.eyJ1IjoiYWl5YW44NzMyIiwiYSI6ImNqaWR2YmFweTBmc3AzcXMwMmsyc2ZjZW4ifQ.jQUXA445gno_CK_at6QgcQ',
    // id: 'mapbox.satellite',
    id: 'mapbox.outdoors',
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	})
	.addTo(myMap);

// Define a markerSize function that will give each earthquate a different radius based on its magnitude
function markerSize(mag) {
  return mag * 4;
}

function fillColor(mag) {
  if (mag<1) {
    return "#8BC34A";
  } else if (mag<2) {
    return "#CDDC39";
  } else if (mag<3) {
    return "#FFEB3B";
  } else if (mag<4) {
    return "#FFC107";
  } else if (mag<5) {
    return "#FF9800";
  } else {
    return "#FF5722";
  }
}

// Link to GeoJSON
var APILink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Grabbing data with d3...
d3.json(APILink, function(data) {
  // Creating a GeoJSON layer with the retrieved data
  console.log(data);

  // Creating a GeoJSON layer with the retrieved data
  var earthquake = L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: fillColor(feature.properties.mag),
        color: "#616161",
        weight: 1,
        opacity: 1,
        fillOpacity: 1
      });
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup(feature.properties.place + "<br>Earthquake magnitude: "
        + feature.properties.mag);
    }
  }).addTo(myMap);

  // Setting up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var colors = ["#8BC34A","#CDDC39","#FFEB3B","#FFC107","#FF9800","#FF5722"];
    var mags = ["0-1","1-2","2-3","3-4","4-5","5+"];
    for (var i = 0; i < colors.length; i++) {
      div.innerHTML += "<li style=\"background-color: " + colors[i] + "\"></li>" + mags[i] + "<br>"
    }
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
});



