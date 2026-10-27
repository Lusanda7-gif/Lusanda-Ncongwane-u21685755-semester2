
 // Create the map inside <div id="map">, centred on Hatfield, zoom 16
var map = L.map('map').setView([-25.7545, 28.2314], 16);

// Add the OpenStreetMap background
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var layerControl = L.control.layers({ 'OpenStreetMap': osm },{},{ collapsed: false }
).addTo(map);

function addLayer (file,label,options){
    fetch('data/'+file).then(res=>res.json()).then(data=>{var layer =L.geoJSON(data, options).addTo(map);layerControl.addOverlay(layer, label);});}


// Campus boundary
fetch('data/campus.geojson').then(res => res.json()).then(data=>{
    var campus = L.geoJSON(data,{onEachFeature:(feature,layer)=>layer.bindPopup(popupFromProps(feature.properties))
    }).addTo(map);
    layerControl.addOverlay(campus,'Campus boundary');
    map.fitBounds(campus.getBounds());
  });

 //Buildings (polygons)
addLayer('footprints.geojson', 'Buildings', {
  style: { color: "black", weight: 1 },
  onEachFeature: (feature, layer) => layer.bindPopup(popupFromProps(feature.properties))
});

// Footpaths (lines)
addLayer('pathway.geojson', 'Footpaths', {
style: { color: "orange", weight: 3 },
onEachFeature: (feature, layer) => layer.bindPopup(popupFromProps(feature.properties))
});

// Bathrooms (points)
addLayer('bathroom.geojson', 'Bathrooms', {
pointToLayer: (feature, latlng) =>
L.circleMarker(latlng, { radius: 6, color: "blue"}),
  onEachFeature: (feature, layer) => layer.bindPopup(popupFromProps(feature.properties))
});

// Eateries (points)
addLayer('eatery.geojson', 'Eateries', {
pointToLayer: (feature, latlng) =>
L.circleMarker(latlng, { radius: 6, color: '#4e342e', fillColor: '#8d6e63', fillOpacity: 0.9 }),
onEachFeature: (feature, layer) => layer.bindPopup(popupFromProps(feature.properties))
});

// Builds popup text from every field in a feature
function popupFromProps(props) {
  var html = '';
  for (var key in props) {
    html += '<b>' + key + ':</b> ' + props[key] + '<br>';
  }
  return html;
}