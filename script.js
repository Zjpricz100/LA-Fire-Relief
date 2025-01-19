
// Sets up the basic map functionality through leaflet
function setUpMap() {
    
    var map = L.map('map').setView([34.0522, -118.2437], 10); // Los Angeles coordinates
    // Add the Esri World Imagery base layer
    var Stadia_StamenTonerLite = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.{ext}', {
        minZoom: 0,
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'png'
    }).addTo(map);

    return map
}

// One time function designed to easily view the JSON data from requests
function writeJSONData(json) {
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    console.log(json)
    link.href = URL.createObjectURL(blob);
    link.download = 'data.json'; // File name
    link.click(); // Trigger download

}

async function fetchFireData(locations) {
    const baseUrl = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/WFIGS_Interagency_Perimeters_Current/FeatureServer/0/query";
    
    const locationValues = locations.map(location => `'${location}'`).join(', ');
    const whereClause = `poly_IncidentName IN (${locationValues})`;
    
    const params = new URLSearchParams({
        where: whereClause,
        outFields: "*",
        outSR: "4326",
        f: "json"
    });
    const fullUrl = `${baseUrl}?${params.toString()}`;
    const noFilterUrl = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/WFIGS_Interagency_Perimeters_Current/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json";
    try {
        const response = await fetch(noFilterUrl);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        //writeJSONData(json);
        return json;


    } catch (error) {
       console.log("ERROR");
       console.log(error.name, error.message) 
    }

    
}

// Draws the fire perimeter polygons onto leaflet interactive map from the given json file 
function drawPolygons(map, data) {

    for (const feature of data.features) {
        const rings = feature.geometry.rings;
        largestRingIndex = findLargestRing(rings);
        const outerRing = rings[largestRingIndex];
        coordinates = outerRing.map(([x, y]) => [y, x]);
        L.polygon(coordinates, {color: 'red'}).addTo(map);


  
        //const outerRing = feature.geometry.rings[0];
        
        
    }

}

function findLargestRing(rings) {
    var largestRingIndex = 0;
    var largestArea = 0;
    index = 0
    for (const ring of rings) {
        if (ring.length >= 4) {
            const polygon = turf.polygon([ring]);
            const area = turf.area(polygon);

            if (area > largestArea) {
                largestArea = area;
                largestRingIndex = index
            }
            index++;
        }
    } 
    return largestRingIndex;
}

async function main() {
    const locations = ['PALISADES', 'EATON'];
    var map = setUpMap()
    try {
        const incidentData = await fetchFireData(locations);
        console.log(incidentData);
        drawPolygons(map, incidentData);

    }
    catch (error) {
        console.error("Failed to fetch incident data or process incident data.", error);
    }
}

main();







