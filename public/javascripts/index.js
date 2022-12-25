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

// var marker = L.marker([34.70612, 33.11655]).addTo(map);



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



var inputFrom = document.getElementById("from-input");
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

const comma = ", ";
const suggestionsFrom = document.querySelector(".suggestionsFrom ul")
const suggestionsTo = document.querySelector(".suggestionsTo ul")

var fromCoordinates = [];
var toCoordinates = [];

function formatSuggestionDisplay (item) {
    let displayString = ""

    if (item.building != undefined) {
        displayString += item.building + comma;
    }
    if (item.road != undefined) {
        displayString += item.road + comma;
    }
    if (item.quarter != undefined) {
        displayString += item.quarter + comma;
    }
    if (item.suburb != undefined) {
        displayString += item.suburb + comma;
    }
    if (item.neighbourhood != undefined) {
        displayString += item.neighbourhood + comma;
    }
    if (item.village != undefined) {
        displayString += item.village + comma;
    }
    if (item.state_district != undefined) {
        displayString += item.state_district + comma;
    }
    if (item.postcode != undefined) {
        displayString += item.postcode;
    }

    return displayString;
}

async function searchAddress(str, field) {
    let results = await provider.search({ query: str })
    let suggestions;
    field == "from-input"? suggestions = suggestionsFrom : suggestions = suggestionsTo;

    suggestions.innerHTML = "";

    if(results.length > 0) {
        for (var i=0; i < results.length; i++) {
            let item = results[i];

            // exclude north
            if (item.raw.address.state != "Νότια Κύπρος") {
                continue;
            }

            let displayString = item.label;
            suggestions.innerHTML += `<li class=${field} id=${results[i].x +","+ results[i].y}>${displayString}</li>`;

        }
    } else {
        results = [];
		suggestions.innerHTML = '';
    }

}

function searchHandler(e) {
    const inputVal = e.currentTarget.value;
    let results = [];
    if(inputVal.length > 1) {
        results = searchAddress(inputVal, e.currentTarget.id);
    }
}

function useSuggestion(e) {
    let input
    let suggestions
    let coordinates
    if (e.target.className == "from-input") {
        suggestions = suggestionsFrom
        input = inputFrom;
        inputTo.focus();
        coordinates = fromCoordinates;
    } else {
        suggestions = suggestionsTo
        input = inputTo;
        coordinates = toCoordinates
    }

	input.value = e.target.innerText;
	suggestions.innerHTML = '';

    let targetCoordinates = e.target.id;

    coordinates[0] = targetCoordinates.split(",")[1];
    coordinates[1] = targetCoordinates.split(",")[0];

    L.marker(coordinates, {draggable:'true'}).addTo(map);
    map.setView(coordinates)

    if (e.target.className == "to-input") {
        var latlngs = [
            toCoordinates,
            fromCoordinates
        ];
        
        var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);

        // zoom the map to the polyline
        map.fitBounds(polyline.getBounds());
    }

}


inputFrom.addEventListener("keyup", searchHandler)
inputTo.addEventListener("keyup", searchHandler)
suggestionsFrom.addEventListener("click", useSuggestion)
suggestionsTo.addEventListener("click", useSuggestion)