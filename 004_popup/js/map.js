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
    // PopUp
    ///////////////////////////////////////
    // Define a pop-up for Trailheads
    const popupTrailheads = {
        "title": "Trailhead",
        "content": "<b>Trail:</b> {TRL_NAME}<br><b>City:</b> {CITY_JUR}<br><b>Cross Street:</b> {X_STREET}<br><b>Parking:</b> {PARKING}<br><b>Elevation:</b> {ELEV_FT} ft"
    }
    //Trailheads feature layer (points)
    const trailheadsLayer = new FeatureLayer({
        url: "https://services8.arcgis.com/gvVQqQbAb6dchyJG/arcgis/rest/services/trailheads/FeatureServer/0",
        outFields: ["TRL_NAME", "CITY_JUR", "X_STREET", "PARKING", "ELEV_FT"],
        popupTemplate: popupTrailheads
    });
    map.add(trailheadsLayer);

    // Define a popup for Trails
    const popupTrails = {
        title: "Trail Information",
        content: [{
            type: "media",
            mediaInfos: [{
                type: "column-chart",
                caption: "Novi",
                value: {
                    fields: ["ELEV_MIN", "ELEV_MAX"],
                    normalizeField: null,
                    tooltipField: "Min and max elevation values"
                }
            }]
        }]
    }
    const trails = new FeatureLayer({
        url: "https://services8.arcgis.com/gvVQqQbAb6dchyJG/arcgis/rest/services/trails/FeatureServer/0",
        outFields: ["TRL_NAME", "ELEV_GAIN"],
        popupTemplate: popupTrails
    });

    map.add(trails, 0);

    // Define popup for Parks and Open Spaces
    const popupOpenspaces = {
        "title": "{PARK_NAME}",
        "content": [{
            "type": "fields",
            "fieldInfos": [{
                    "fieldName": "AGNCY_NAME",
                    "label": "Agency",
                    "isEditable": true,
                    "tooltip": "",
                    "visible": true,
                    "format": null,
                    "stringFieldOption": "text-box"
                },
                {
                    "fieldName": "TYPE",
                    "label": "Type",
                    "isEditable": true,
                    "tooltip": "",
                    "visible": true,
                    "format": null,
                    "stringFieldOption": "text-box"
                },
                {
                    "fieldName": "ACCESS_TYP",
                    "label": "Access",
                    "isEditable": true,
                    "tooltip": "",
                    "visible": true,
                    "format": null,
                    "stringFieldOption": "text-box"
                },

                {
                    "fieldName": "GIS_ACRES",
                    "label": "Acres",
                    "isEditable": true,
                    "tooltip": "",
                    "visible": true,
                    "format": {
                        "places": 2,
                        "digitSeparator": true
                    },

                    "stringFieldOption": "text-box"
                }
            ]
        }]
    }

    const openspaces = new FeatureLayer({
        url: "https://services8.arcgis.com/gvVQqQbAb6dchyJG/arcgis/rest/services/parks_and_open_space/FeatureServer/0",
        outFields: ["TYPE", "PARK_NAME", "AGNCY_NAME", "ACCESS_TYP", "GIS_ACRES", "TRLS_MI", "TOTAL_GOOD", "TOTAL_FAIR", "TOTAL_POOR"],
        popupTemplate: popupOpenspaces
    });

    map.add(openspaces, 0);
});