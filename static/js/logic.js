// static/js/logic.js

// Define the URL for the earthquake data
const earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create the map object with center and zoom level
const map = L.map('map').setView([37.7749, -122.4194], 5);

// Add a new tile layer to the map for a different design
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(map);

// Store the earthquake layer
let earthquakeLayer;

// Fetch the earthquake data
d3.json(earthquakeUrl).then(data => {
  // Function to determine the color based on depth
  function getColor(magnitude) {
    return magnitude > 5 ? '#d73027' :  // Red
           magnitude > 4 ? '#fc8d59' :  // Light Red-Orange
           magnitude > 3 ? '#fee08b' :  // Light Yellow
           magnitude > 2 ? '#d9ef8b' :  // Light Green-Yellow
           magnitude > 1 ? '#91cf60' :  // Green
                           '#1a9850';   // Dark Green
  }
  

  // Function to create a popup for each feature
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

  // Function to create a circle marker
  function pointToLayer(feature, latlng) {
    return L.circleMarker(latlng, {
      radius: feature.properties.mag * 3,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    });
  }

  // Add GeoJSON layer to the map
  earthquakeLayer = L.geoJSON(data, {
    pointToLayer: pointToLayer,
    onEachFeature: onEachFeature
  }).addTo(map);

  // Create a legend
  const legend = L.control({ position: 'bottomright' });
  legend.onAdd = function() {
    const div = L.DomUtil.create('div', 'info legend');
    const grades = [0, 10, 30, 50, 70, 90];
    const colors = ['#00FFFF', '#00FF00', '#7FFF00', '#FFFF00', '#FF7F00', '#FF0000'];
    
    // Loop through grades and generate a label with a colored square for each interval
    for (let i = 0; i < grades.length; i++) {
      div.innerHTML +=
        `<i style="background:${colors[i]}"></i> ${grades[i]}${(grades[i + 1] ? '&ndash;' + grades[i + 1] : '+')}<br>`;
    }
    return div;
  };
  legend.addTo(map);

  // Add a control to filter earthquakes by magnitude range
  const filterControl = L.control({ position: 'topright' });
  filterControl.onAdd = function() {
    const div = L.DomUtil.create('div', 'filter control');
    div.innerHTML = `
      <h4>Filter Earthquakes</h4>
      <input type="checkbox" id="magnitude1" checked> Magnitude 1-2<br>
      <input type="checkbox" id="magnitude2" checked> Magnitude 2-3<br>
      <input type="checkbox" id="magnitude3" checked> Magnitude 3-4<br>
      <input type="checkbox" id="magnitude4" checked> Magnitude 4-5<br>
      <input type="checkbox" id="magnitude5" checked> Magnitude 5+<br>
    `;
    return div;
  };
  filterControl.addTo(map);

  // Event listeners for the filter checkboxes
  document.getElementById('magnitude1').addEventListener('change', updateFilter);
  document.getElementById('magnitude2').addEventListener('change', updateFilter);
  document.getElementById('magnitude3').addEventListener('change', updateFilter);
  document.getElementById('magnitude4').addEventListener('change', updateFilter);
  document.getElementById('magnitude5').addEventListener('change', updateFilter);

  function updateFilter() {
    const showMagnitude1 = document.getElementById('magnitude1').checked;
    const showMagnitude2 = document.getElementById('magnitude2').checked;
    const showMagnitude3 = document.getElementById('magnitude3').checked;
    const showMagnitude4 = document.getElementById('magnitude4').checked;
    const showMagnitude5 = document.getElementById('magnitude5').checked;

    // Remove current layer and add filtered data
    if (earthquakeLayer) {
      map.removeLayer(earthquakeLayer);
    }

    earthquakeLayer = L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        const mag = feature.properties.mag;
        if ((mag > 0 && mag <= 2 && showMagnitude1) ||
            (mag > 2 && mag <= 3 && showMagnitude2) ||
            (mag > 3 && mag <= 4 && showMagnitude3) ||
            (mag > 4 && mag <= 5 && showMagnitude4) ||
            (mag > 5 && showMagnitude5)) {
          return L.circleMarker(latlng, {
            radius: feature.properties.mag * 3,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          });
        }
      },
      onEachFeature: onEachFeature
    }).addTo(map);
  }
});
