"use strict";

var _leafletGeosearch = require("C:/Users/Alexandros/Documents/TaxiWeb/node_modules/leaflet-geosearch/dist/index");
// const { search } = require("../../routes");
console.log("ok");

// import 'node_modules/leaflet-geosearch/dist/geosearch.css';
// import { OpenStreetMapProvider } from 'leaflet-geosearch';

// import * as GeoSearch from '../../node_modules/leaflet-geosearch';
// const provider = new OpenStreetMapProvider();

var map = L.map('map').setView([34.70612, 33.11655], 15);
map.setGeocoder('Nominatim');
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
var marker = L.marker([34.70612, 33.11655]).addTo(map);
map.addControl(L.control.search({
  position: 'bottomright'
}));
var searchBar = map.addControl(L.control.search({
  position: 'bottomright'
}));

// var searchText = L.control.search

// map.addControl( new L.Control.Search({
//     container: 'findbox',
//     // layer: markersLayer,
//     initial: false,
//     collapsed: false
// }) );

// $(document).ready(function () {

//     var newParent = document.getElementById('from');
//             var oldParent = document.getElementsByClassName("geo-search leaflet-control")

//             while (oldParent[0].childNodes.length > 0) {
//                 newParent.appendChild(oldParent[0].childNodes[0]);
//             }
//      });

// const search = new GeoSearch.GeoSearchControl({
//     rovider: new GeoSearch.OpenStreetMapProvider(),
// });

// map.addControl(search);