// static/js/logic.js

// Define the URLs for the earthquake data and tectonic plates data
const earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
const tectonicPlatesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Create the map object with center and zoom level
const map = L.map('map').setView([37.7749, -122.4194], 5);

// Define base maps
const baseMaps = {
  "Carto Voyager": L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }).addTo(map), // This is the default base map
  "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }),
  "Esri WorldImagery": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  })
};

// Store the earthquake and tectonic plates layers
let earthquakeLayer;
let tectonicPlatesLayer;

// Fetch and plot the earthquake data
d3.json(earthquakeUrl).then(data => {
  function getColor(magnitude) {
    return magnitude > 5 ? '#d73027' :
           magnitude > 4 ? '#fc8d59' :
           magnitude > 3 ? '#fee08b' :
           magnitude > 2 ? '#d9ef8b' :
           magnitude > 1 ? '#91cf60' :
                           '#1a9850';
  }

  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

  function pointToLayer(feature, latlng) {
    return L.circleMarker(latlng, {
      radius: feature.properties.mag * 3,
      fillColor: getColor(feature.properties.mag),
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    });
  }

  earthquakeLayer = L.geoJSON(data, {
    pointToLayer: pointToLayer,
    onEachFeature: onEachFeature
  }).addTo(map);

  // Create a legend
  const legend = L.control({ position: 'bottomright' });
  legend.onAdd = function() {
    const div = L.DomUtil.create('div', 'info legend');
    const grades = [0, 1, 2, 3, 4, 5];
    const colors = ['#1a9850', '#91cf60', '#d9ef8b', '#fee08b', '#fc8d59', '#d73027'];
    
    // Loop through grades and generate a label with a colored square for each interval
    for (let i = 0; i < grades.length; i++) {
      div.innerHTML +=
        `<i style="background:${colors[i]}"></i> ${grades[i]}${(grades[i + 1] ? '&ndash;' + grades[i + 1] : '+')}<br>`;
    }
    return div;
  };
  legend.addTo(map);
});

// Fetch and plot the tectonic plates data
d3.json(tectonicPlatesUrl).then(data => {
  tectonicPlatesLayer = L.geoJSON(data, {
    style: {
      color: '#FF6347',
      weight: 2
    }
  }).addTo(map);
});

// Add overlay layers
const overlayMaps = {
  "Earthquakes": earthquakeLayer,
  "Tectonic Plates": tectonicPlatesLayer
};

// Add layer controls to the map
L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);

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

  if (earthquakeLayer) {
    map.removeLayer(earthquakeLayer);
  }

  d3.json(earthquakeUrl).then(data => {
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
            fillColor: getColor(feature.properties.mag),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          });
        }
      },
      onEachFeature: onEachFeature
    }).addTo(map);
  });
}
