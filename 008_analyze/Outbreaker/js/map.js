require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/layers/MapImageLayer",
    "esri/renderers/ClassBreaksRenderer",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",
    "esri/geometry/geometryEngine",
    "esri/layers/GraphicsLayer",
    "esri/Graphic",
    "dojo/on",
    "dojo/dom",
    "dojo/dom-style"
], function (Map, MapView, FeatureLayer, MapImageLayer,
    ClassBreaksRenderer, SimpleMarkerSymbol, SimpleFillSymbol,
    QueryTask, Query, geometryEngine, GraphicsLayer, Graphic,
    on, dom, domStyle) {
    var map = new Map({
        basemap: "gray"
    });

    var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-104.928591, 39.732578],
        zoom: 10
    });

    // Patient data layer
    var patientDataLayer = new FeatureLayer({
        // replace with your Patient Data feature service URL
        url: "https://services5.arcgis.com/zMQkoTAh5uCFjA7j/arcgis/rest/services/PatientData2018/FeatureServer/0"
    });

    var cbRenderer = new ClassBreaksRenderer({
        field: "Age"
    });
    cbRenderer.addClassBreakInfo({
        minValue: 0,
        maxValue: 4,
        symbol: new SimpleMarkerSymbol({
            style: "diamond",
            color: [255, 0, 0, 0.25],
            size: 15
        })
    });
    cbRenderer.addClassBreakInfo({
        minValue: 5,
        maxValue: 13,
        symbol: new SimpleMarkerSymbol({
            style: "diamond",
            color: [0, 0, 255, 0.15],
            size: 15
        })
    });
    patientDataLayer.renderer = cbRenderer;
    map.add(patientDataLayer);


    // helper functions
    function showLoadingSpinner() {
        var spinnerNode = dom.byId(loadingImg);
        domStyle.set(spinnerNode, "display", "block");
    }

    function hideLoadingSpinner() {
        var spinnerNode = dom.byId(loadingImg);
        domStyle.set(spinnerNode, "display", "none");
    }

    function displayMyPolygon(polygonGeometry, aColorString, anOpacity) {
        var aGraphic = new Graphic({
            geometry: polygonGeometry,
            symbol: new SimpleFillSymbol({
                color: aColorString,
                style: "solid"
            })
        });
        // if opacity was not specified, default to 1.0
        if (anOpacity) {} else {
            anOpacity = 1.0;
        }
        aGraphic.symbol.color.a = anOpacity;
        graphicsLayer.graphics.add(aGraphic);
    }


    /*********************************************************
     * Analysis - Finding Suitable Locations
     ********************************************************/

    // Create a graphics layer to display results
    var graphicsLayer = new GraphicsLayer({
        graphics: []
    });
    map.add(graphicsLayer);

    // Global variables for intermediate outputs
    var gCriteria01Geometry;
    var gCriteria02Geometry;

    // Analysis functions
    function countPerZIPCode(inputLayer) {

        // Get all features from the input layer
        var q = patientDataLayer.createQuery();
        q.outFields = ["ZIP"];
        return inputLayer.queryFeatures(q).then(function (response) {

            // Tally the patients per ZIP code
            var dict = {};
            var zip;
            response.features.forEach(function (item) {
                zip = item.attributes.ZIP;
                if (dict[zip] == undefined) {
                    dict[zip] = 1;
                } else {
                    dict[zip] = dict[zip] + 1;
                }
            });
            // Evaluate dictionary to find the ZIP code
            // with the most patients
            console.log(dict);
            return Object.keys(dict).reduce(function (key1, key2) {
                return dict[key1] > dict[key2] ? key1 : key2;
            });
        });
    }

    function bufferByDistance(sickestZIP) {

        // Perform an attribute query on the Median Age
        // layer to get the ZIP code feature
        var q = new Query();
        q.where = "ID = '" + sickestZIP + "'";
        q.returnGeometry = true;
        var medianAgeQueryTask = new QueryTask({
            url: "https://demographics8.arcgis.com/arcgis/rest/services/USA_Demographics_and_Boundaries_2018/MapServer/10"
        });
        return medianAgeQueryTask.execute(q).then(function (response) {

            console.log("bufferByDistance",sickestZIP);
            // Get the ZIP code's geometry from the feature
            console.log(response);
            return response.features[0].geometry;

        }).then(function (sickestZIPGeometry) {

            // Perform the buffer and store result in global var
            gCriteria01Geometry = geometryEngine.buffer(
                sickestZIPGeometry,
                dom.byId("bufferSelect").value,
                "miles"
            ); // dom.byId("bufferSelect").value

            // DEBUG
            // displayMyPolygon(gCriteria01Geometry, "red");
            // displayMyPolygon(sickestZIPGeometry, "green");
        });
    }

    function queryPopulation() {

        // Perform an attribute query to find ZIP codes
        // with more then 4000 children ages 0-4
        var q = new Query({
            where: "POP0_CY > " + dom.byId("populationSelect").value + " AND ST_ABBREV = 'CO'", // " + dom.byId("populationSelect").value + "
            outFields: "POP0_CY",
            returnGeometry: true
        });
        var medianAgeQueryTask = new QueryTask({
            url: "https://demographics8.arcgis.com/arcgis/rest/services/USA_Demographics_and_Boundaries_2018/MapServer/10"
        });
        return medianAgeQueryTask.execute(q).then(function (response) {

            // Process ZIP code features to
            // extract just the geometries
            return response.features.map(function (aFeature) {
                return aFeature.geometry;
            });

        }).then(function (arrGeometries) {

            // Union geometries together into a single geometry object
            gCriteria02Geometry = geometryEngine.union(arrGeometries);

            // DEBUG
            // displayMyPolygon(gCriteria02Geometry, "orange");
        });
    }

    function intersectCriteria() {

        // Find the intersection of the areas
        // defined by the two criteria
        var quarantineAreas = geometryEngine.intersect(
            gCriteria01Geometry,
            gCriteria02Geometry
        );

        displayMyPolygon(quarantineAreas, "yellow", 0.6);
    }

    // Wait for the view and patient data layer to finish
    // loading before calling each analysis function in turn
    showLoadingSpinner();
    view.when(patientDataLayer.when()
         .then(countPerZIPCode)
         .then(bufferByDistance)
         .then(queryPopulation)
         .then(intersectCriteria)
        .then(hideLoadingSpinner)
    );


    // Perform analysis on demand
    dom.byId("runBtn").addEventListener("click", function() {
        showLoadingSpinner();
        graphicsLayer.removeAll();
        view.when(patientDataLayer.when()
                    .then(countPerZIPCode)
                    .then(bufferByDistance)
                    .then(queryPopulation)
                    .then(intersectCriteria)
                    .then(hideLoadingSpinner)
        );
    });
    view.ui.add("menu", "top-right");

    /*********************************************************
     * Analysis - Distributing and Accessing Resources
     ********************************************************/
    //    var hospitalDriveTimesLayer = new FeatureLayer({
    //        url: "" // paste in your layer's Service URL
    //    });
    //    map.add(hospitalDriveTimesLayer);

});