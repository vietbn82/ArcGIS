require(["esri/config",
    "esri/Map",
    "esri/views/MapView",

    "esri/Basemap",
    "esri/layers/VectorTileLayer",
    "esri/layers/TileLayer",

], function (esriConfig, Map, MapView, Basemap, VectorTileLayer, TileLayer) {
    ///////////////////////////////////////
    //CONFIG
    ///////////////////////////////////////
    esriConfig.apiKey =
        "AAPK4b64c2dbe7d145f094823d0b55644471j3Jbii5XHNwHd4jCliS78ENvE-1TTC5ZH8v_9RYXlFElVlwD-Jn0Cw8jwBglVozN";


    ///////////////////////////////////////
    // create map layer
    ///////////////////////////////////////

    const vectorTileLayer = new VectorTileLayer({
        portalItem: {
            id: "6976148c11bd497d8624206f9ee03e30" // Forest and Parks Canvas
        },
        opacity: .75
    });
    const imageTileLayer = new TileLayer({
        portalItem: {
            id: "1b243539f4514b6ba35e7d995890db1d" // World Hillshade
        }
    });

    const basemap = new Basemap({
        baseLayers: [

            imageTileLayer,
            vectorTileLayer

        ]
    });
    const map = new Map({
        basemap: basemap,
    });

    const view = new MapView({
        container: "viewDiv",
        map: map,
    
        center: [-100,40],
        zoom: 3
    
      });
});