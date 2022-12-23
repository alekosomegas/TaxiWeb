// const { search } = require("../../routes");

var map = L.map('map').setView([34.70612, 33.11655], 15);
map.setGeocoder('Nominatim');

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var marker = L.marker([34.70612, 33.11655]).addTo(map);



map.addControl(L.control.search({ position: 'bottomright' }))
var searchBar = map.addControl(L.control.search({ position: 'bottomright' }))

// var searchText = L.control.search


// map.addControl( new L.Control.Search({
//     container: 'findbox',
//     // layer: markersLayer,
//     initial: false,
//     collapsed: false
// }) );


$(document).ready(function () {

    var newParent = document.getElementById('from');
            var oldParent = document.getElementsByClassName("geo-search leaflet-control")
    
            while (oldParent[0].childNodes.length > 0) {
                newParent.appendChild(oldParent[0].childNodes[0]);
            }
     });