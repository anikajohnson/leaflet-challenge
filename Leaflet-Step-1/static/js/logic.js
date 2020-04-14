// Create a map using Leaflet that plots all of the earthquakes
// from your data set based on their longitude and latitude.

// Store API link
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// function to define marker size
function markerSize(mag) {
  return mag * 30000;
}

// function to define marker color based on magnitude
function markerColor(mag) {
  if (mag <= 1) {
      return "#ffedbf";
  } else if (mag <= 2) {
      return "#fce772";
  } else if (mag <= 3) {
      return "#ff9933";
  } else if (mag <= 4) {
      return "#ffd700";
  } else if (mag <= 5) {
      return "#f7362d"; 
  } else {
      return "#9b2948";
  };
}
// data request
d3.json(link, function(data) {
  // 
  createFeatures(data.features);
  console.log(data.features)
});

// Function to create popups that provide additional information about the earthquake when a marker is clicked
function createFeatures(earthquakeData) {

  var earthquakes = L.geoJSON(earthquakeData, {
   // For each feature in the features array
   onEachFeature : function (feature, layer) {
      // create a popup describing place, time magnitude of the earthquake
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " +  feature.properties.mag + "</p>")
      },     pointToLayer: function (feature, latlng) {
        // create data markers using size and color functions 
        return new L.circle(latlng,
          {radius: markerSize(feature.properties.mag),
          fillColor: markerColor(feature.properties.mag),
          fillOpacity: 1,
          stroke: false,
      })
    }
    });
    
  // apply earthquakes layer to createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create satelitemap and darkmap layers
  var satelitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Create baseMaps 
  var baseMaps = {
    "Satelite Map": satelitemap,
    "Dark Map": darkmap
  };

  // Create overlay 
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create map with satelitemap and earthquakes layers
  var myMap = L.map("map", {
    center: [31.57853542647338,-99.580078125],
    zoom: 3,
    layers: [satelitemap, earthquakes]
  });

  // Create a legend that will provide context for your map data
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          magnitudes = [0, 1, 2, 3, 4, 5];
  
      for (var i = 0; i < magnitudes.length; i++) {
          div.innerHTML +=
              '<i style="background:' + markerColor(magnitudes[i] + 1) + '"></i> ' + 
      + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + ');
      }
  
      return div;
  };
  
  legend.addTo(myMap);

}