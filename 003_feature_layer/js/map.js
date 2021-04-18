require(["esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer"

], function (esriConfig, Map, MapView, Graphic, GraphicsLayer, FeatureLayer) {
    ///////////////////////////////////////
    //CONFIG
    ///////////////////////////////////////
    esriConfig.apiKey =
        "AAPK4b64c2dbe7d145f094823d0b55644471j3Jbii5XHNwHd4jCliS78ENvE-1TTC5ZH8v_9RYXlFElVlwD-Jn0Cw8jwBglVozN";

    ///////////////////////////////////////
    // create map layer
    ///////////////////////////////////////
    const map = new Map({
        basemap: "arcgis-topographic" // Basemap layer service
    });
    const view = new MapView({
        map: map,
        center: [-118.805, 34.027], // Longitude, latitude 
        zoom: 13, // Zoom level
        container: "viewDiv" // Div element
    });

    ///////////////////////////////////////
    // Feature layer
    ///////////////////////////////////////
    //Trailheads feature layer (points)
    const trailheadsLayer = new FeatureLayer({
        url: "https://services8.arcgis.com/gvVQqQbAb6dchyJG/arcgis/rest/services/trailheads/FeatureServer/0"
    });
    map.add(trailheadsLayer);

    //Trails feature layer (lines)
    const trailsLayer = new FeatureLayer({
        url: "https://services8.arcgis.com/gvVQqQbAb6dchyJG/arcgis/rest/services/trails/FeatureServer/0"
    });
    map.add(trailsLayer);
    // Parks and open spaces (polygons)
    const parksLayer = new FeatureLayer({
        url: "https://services8.arcgis.com/gvVQqQbAb6dchyJG/arcgis/rest/services/parks_and_open_space/FeatureServer/0"
    });
    map.add(parksLayer);
});