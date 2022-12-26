
class Location {
    constructor() {
        this.lat = null;
        this.lng = null;
        this.marker = null;
    }

    getCoordinates() {
        return [this.lat, this.lng];
    }
}

class Route {
    constructor() {
        this.pickUp = new Location;
        this.destination = new Location;
    }
}


var route = new Route();


var greenIcon = L.icon({
    iconUrl: 'images/baseline-person_pin_circle-24px@2x.png',


    iconSize:     [36, 45], // size of the icon
    shadowSize:   [0, 0], // size of the shadow
    iconAnchor:   [18, 40], // point of the icon which will correspond to marker's location
    shadowAnchor: [0, 0],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var map = L.map('map').setView([34.70612, 33.11655], 15);
map.setGeocoder('Nominatim');


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


const provider = new GeoSearch.OpenStreetMapProvider({
    params: {
    'accept-language': 'gb', // render results in Dutch
    countrycodes: 'cy', // limit search results to the Netherlands
    addressdetails: 1, // include additional address detail parts
    },
});


var inputFrom = document.getElementById("from-input");
var inputTo = document.getElementById("to-input");

const suggestionsFrom = document.querySelector(".suggestionsFrom ul")
const suggestionsTo = document.querySelector(".suggestionsTo ul")


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
var polyline;

function useSuggestion(e) {
    let input
    let suggestions
    let coordinates
    let markerTitle
    let location
    if (e.target.className == "from-input") {
        suggestions = suggestionsFrom
        input = inputFrom;
        inputTo.focus();
        coordinates = route.pickUp;
        markerTitle = "Pick up"
        location = route.pickUp;
    } else {
        suggestions = suggestionsTo
        input = inputTo;
        coordinates = route.destination
        markerTitle = "Destination"
        location = route.destination;
    }

	input.value = e.target.innerText;
	suggestions.innerHTML = '';

    let targetCoordinates = e.target.id;

    coordinates.lat = targetCoordinates.split(",")[1];
    coordinates.lng = targetCoordinates.split(",")[0];

    if (e.target.className == "from-input") {
        var marker = L.marker(coordinates, {icon: greenIcon, draggable:'true', autoPan: true, riseOnHover: true, title: markerTitle }).addTo(map);
    } else {
        var marker = L.marker(coordinates, { draggable:'true', autoPan: true, riseOnHover: true, title: markerTitle }).addTo(map);
    }

    map.setView(coordinates)
    marker.addEventListener("moveend", markerMoveHandler)
    location.marker = marker;




    if (e.target.className == "to-input") {
        var latlngs = [
            route.pickUp.getCoordinates() ,
            route.destination.getCoordinates()
        ];
        
        polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);

        // zoom the map to the polyline
        map.fitBounds(polyline.getBounds());
    }

}

async function markerMoveHandler(e) {
    let marker = e.target;
    let input 
    if (marker === route.pickUp.marker) {
        route.pickUp.lat = e.target._latlng.lat
        route.pickUp.lng = e.target._latlng.lng
        input = inputFrom
    } else {
        route.destination.lat = e.target._latlng.lat
        route.destination.lng = e.target._latlng.lng
        input = inputTo
    }


    var latlngs = [
        route.destination.getCoordinates(),
        route.pickUp.getCoordinates()
    ];
    polyline.setLatLngs(latlngs)

    let url = `https://nominatim.openstreetmap.org/reverse?lat=${e.target._latlng.lat}&lon=${e.target._latlng.lng}&zoom=18&format=json`

    var result = fetch(url)
    .then(response => {
        if(!response.ok){
        }
        return response.json()
    })
    .then(responseJson =>{
        input.value = responseJson.display_name;
    })
}

inputFrom.addEventListener("keyup", searchHandler)
inputTo.addEventListener("keyup", searchHandler)
suggestionsFrom.addEventListener("click", useSuggestion)
suggestionsTo.addEventListener("click", useSuggestion)