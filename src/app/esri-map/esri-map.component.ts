// Look at ArcGISDynamicMapServiceLayer

import { Component, OnInit, ViewChild, ElementRef, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { loadModules } from 'esri-loader';
//import esri = __esri;

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {

  // this is needed to be able to create the MapView at the DOM element in this component
  @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;

  constructor() { }

  ngOnInit() {
    loadModules([
      "esri/tasks/Locator",
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/FeatureLayer",
      "esri/widgets/Search",
      "esri/widgets/Compass",
      "esri/widgets/Locate",
      "esri/core/watchUtils",
      "esri/request"
    ])
      .then(([Locator, EsriMap, EsriMapView, FeatureLayer, Search, Compass, Locate, watchUtils, esriRequest]) => {
        // Create a locator task using the world geocoding service
        const locatorTask = new Locator({
          url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
        });

        var map = new EsriMap({
          // basemap: 'dark-gray-vector'
          basemap: 'gray-vector'
        })

        const view = new EsriMapView({
          container: this.mapViewEl.nativeElement,
          center: [-106.3468, 56.1304],
          zoom: 3,
          map: map
        });

        // view.when(function () {
        //   // This function will execute once the promise is resolved
        //   console.log("Map loaded.");
        // })
        //   .catch();

        // // Listen to layerview create event for the layers
        // view.on("layerview-create", function (event) {
        //   console.log("Layer created.");
        // });

        // view.popup.watch("selectedFeature", function (feature) {
        //   if (feature) {
        //     console.log(Object.entries(feature));
        //   }
        // });

        // Search widget
        // Do not include the default map search
        var search = new Search({ view: view, includeDefaultSources: false });

        search.sources.push({
          layer: pollingDivisions,
          searchFields: ["ED_NAMEE"],
          displayField: "ED_NAMEE",
          exactMatch: false,
          outFields: ["ED_NAMEE", "ED_NAMEF"],
          resultGraphicEnabled: true,
          name: "Polling Divisons",
          placeholder: "Example: Thornhill",
        })

        // Compass widget
        var compass = new Compass({ view: view });

        // Locate widget
        var locateWidget = new Locate({ view: view });

        view.ui.add(search, "top-right");
        view.ui.add(compass, "top-left");
        view.ui.add(locateWidget, "top-left");

        var pollingDivisionsLabels = {
          symbol: {
            type: "text",
            color: "#FFFFFF",
            haloColor: "#000000",
            haloSize: "2px",
            font: {
              size: "36px",
              family: "Noto Sans",
              style: "italic",
              weight: "normal"
            }
          },
          //labelPlacement: "above-center",
          labelExpressionInfo: {
            expression: "return $feature[\"ed_namee\"];"
          }
        };

        var pollingDivisions = new FeatureLayer({
          url: "https://services.arcgis.com/txWDfZ2LIgzmw5Ts/arcgis/rest/services/Federal_Electoral_Districts/FeatureServer/0",
          labelingInfo: [pollingDivisionsLabels],
          opacity: 0.50,
          outFields: ["*"],
          popupTemplate: {
            title: "<b>Polling Division:</b> {ED_NAMEE}",
            outFields: ["*"],
           // "content": "<b>FID:</b> {FID}<br><b>OBJECTID:</b> {OBJECTID}<br><b>FED_NUM:</b> {FED_NUM}<br><b>ED_ID:</b> {ED_ID}"
            content: queryDivisionInformation
          }
        });

        map.add(pollingDivisions);

        // var pollingStationsRenderer = {
        //   type: "simple",
        //   symbol: {
        //     type: "picture-marker",
        //     url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRRjHnt5ly0y4GQBASsI0cYKvNuU5sjJfESphFPeSYkLcLtTnSAg",
        //     width: "18px",
        //     height: "18px"
        //   }
        // }

        var pollingStationsLabels = {
          symbol: {
            type: "text",
            color: "#6666A0",
            haloColor: "#000000",
            haloSize: "1px",
            font: {
              size: "20px",
              family: "Noto Sans",
              style: "normal",
              weight: "bold"
            }
          },
          labelPlacement: "above-center",
          labelExpressionInfo: {
            expression: "$feature.site_name"
          }
        };

        var pollingStations = new FeatureLayer({
          url: "https://services.arcgis.com/txWDfZ2LIgzmw5Ts/arcgis/rest/services/Federal_Polling_Stations/FeatureServer/0",
          // renderer: pollingStationsRenderer,
          labelingInfo: [pollingStationsLabels],
          visible: false
        });

        map.add(pollingStations);

        // Create a variable referencing the checkbox node
        var pollingLayerToggle = document.getElementById("pollingLayer") as HTMLInputElement;
        pollingLayerToggle.checked = false;

        // Listen to the change event for the checkbox
        pollingLayerToggle.addEventListener("change", function () {
          // When the checkbox is checked (true), set the layer's visibility to true
          pollingStations.visible = true;
        });

        function queryDivisionInformation(target) {  
          var requestURL = 'https://represent.opennorth.ca/boundaries/federal-electoral-districts/' + target.graphic.attributes.FED_NUM + '/candidates/';

console.log(requestURL);
          
          var options = {
            query: {
              f: 'json'
            },
            responseType: 'json'
          };

          return esriRequest(requestURL, options).then(function (response) {
            var final_results = "<b>FID:</b> {FID}<br><b>OBJECTID:</b> {OBJECTID}<br><b>FED_NUM:</b> {FED_NUM}<br><b>ED_ID:</b> {ED_ID}";

            final_results += "<table>"

            for (var candidate = 0; candidate < Object.keys(response.data.objects).length; candidate++) {
              final_results += "<tr><td>" + response.data.objects[candidate].name + "</td><td>" + response.data.objects[candidate].party_name + "</tr>";
            }

            final_results += "</table>";

            return final_results;
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

}
