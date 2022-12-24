// const { search } = require("../../routes");
console.log("ok")

// import 'node_modules/leaflet-geosearch/dist/geosearch.css';
// import { OpenStreetMapProvider } from 'leaflet-geosearch';
// import { OpenStreetMapProvider } from "leaflet-geosearch";
// import * as GeoSearch from '../../node_modules/leaflet-geosearch';
// const provider = new OpenStreetMapProvider();

var map = L.map('map').setView([34.70612, 33.11655], 15);
map.setGeocoder('Nominatim');

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var marker = L.marker([34.70612, 33.11655]).addTo(map);



// map.addControl(L.control.search({ position: 'bottomright' }))
// var searchBar = map.addControl(L.control.search({ position: 'bottomright' }))

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
//     provider: new GeoSearch.OpenStreetMapProvider(),
//   });

// map.addControl(search);

// const searcher = L.Control.geocoder();
// const searcher2 = L.Control.geocoder();
// searcher.options.collapsed=false;

// searcher.addTo(map);
// searcher2.addTo(map);
// L.Control.geocoder().addTo(map);


const provider = new GeoSearch.OpenStreetMapProvider({
    params: {
    'accept-language': 'gb', // render results in Dutch
    countrycodes: 'cy', // limit search results to the Netherlands
    addressdetails: 1, // include additional address detail parts
    },
});

console.log(provider);
const results = await provider.search({ query: "Thervantes" });
console.log(results[0].label)



var input = document.getElementById("from-input");
var inputTo = document.getElementById("to-input");


// As key typed (minimum 3) start the search(provider.search)
// and didsplay 3 suggestions
// find a way to read the input text (deleted chars)
// add marker on selection
// input.addEventListener("keypress", async (event) => {
//     console.log(event.key)
//     log = log + event.key
//     console.log(log)
//     const results = await provider.search({ query: log});
//     try {
//            console.log(results[0].label) 
//     } catch (e) {
//         console.log(e)
//     }
// })


const suggestions = document.querySelector(".suggestions ul")

async function searchAddress(str) {
    let results = await provider.search({ query: str})

    console.log(results)

    suggestions.innerHTML = "";

    if(results.length > 0) {
        for (var i=0; i < results.length; i++) {
            let item = results[i];
            suggestions.innerHTML += `<li>${item.label}</li>`;
            console.log(results[i].label)
        }
    } else {
        results = [];
		suggestions.innerHTML = '';
    }

}

function searchHandler(e) {
    const inputVal = e.currentTarget.value;
    console.log(e.currentTarget.value)
    let results = [];
    if(inputVal.length > 0) {
        results = searchAddress(inputVal);
        // console.log(results)
    }
    // showSuggestions(results, inputVal);
}

function showSuggestions(results, inputVal) {
    suggestions.innerHTML = "";

    if(results.length > 0) {
        for (i=0; i < results.length; i++) {
            let item = results[i.label];
            suggestions.innerHTML += `<li>${item}</li>`;
            console.log(results[i].label)
        }
    } else {
        results = [];
		suggestions.innerHTML = '';
    }
}

function useSuggestion(e) {
	input.value = e.target.innerText;
	input.focus();
	suggestions.innerHTML = '';
}

input.addEventListener("keyup", searchHandler)
suggestions.addEventListener('click', useSuggestion);