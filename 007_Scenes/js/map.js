require(["esri/config",
    "esri/Map",
    "esri/views/SceneView",
], function (esriConfig, Map, SceneView) {
    ///////////////////////////////////////
    //CONFIG
    ///////////////////////////////////////
    esriConfig.apiKey =
        "AAPK4b64c2dbe7d145f094823d0b55644471j3Jbii5XHNwHd4jCliS78ENvE-1TTC5ZH8v_9RYXlFElVlwD-Jn0Cw8jwBglVozN";

    ///////////////////////////////////////
    // create map layer
    ///////////////////////////////////////
    const map = new Map({
        basemap: "arcgis-topographic",
        ground: "world-elevation",
    });

    const view = new SceneView({
        container: "viewDiv",
        map: map,
        camera: {
            position: {
                x: -118.808, //Longitude
                y: 33.961, //Latitude
                z: 2000 //Meters
            },
            tilt: 75
        }
    });

});