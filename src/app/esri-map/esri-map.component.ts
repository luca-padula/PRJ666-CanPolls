import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
      "esri/widgets/Search"
    ])
      .then(([Locator, EsriMap, EsriMapView, FeatureLayer, Search]) => {
        // Create a locator task using the world geocoding service
        const locatorTask = new Locator({
          url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
        });

        const map = new EsriMap({
          basemap: 'dark-gray-vector'
        });

        const view = new EsriMapView({
          container: this.mapViewEl.nativeElement,
          center: [-79.3500, 43.7957],
          zoom: 7,
          map: map
        });

        // Search widget
        var search = new Search({
          view: view
        });

        view.ui.add(search, "top-right");

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
            //expression: "return $feature[\"pd_num\"] + ' - ' + $feature[\"poll_name\"];"
            expression: "return $feature[\"ed_namee\"];"
          }
        };

        var pollingDivisions = new FeatureLayer({
          //url: "https://services8.arcgis.com/oJlq1EXvPtMkmTJA/arcgis/rest/services/Canada_Polling_Divisions_2019/FeatureServer/0",
          url: "https://services.arcgis.com/txWDfZ2LIgzmw5Ts/arcgis/rest/services/Federal_Electoral_Districts/FeatureServer/0",
          labelingInfo: [pollingDivisionsLabels],
          opacity: 0.50
        });

        map.add(pollingDivisions);

        var pollingStationsRenderer = {
          type: "simple",
          symbol: {
            type: "picture-marker",
            url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRRjHnt5ly0y4GQBASsI0cYKvNuU5sjJfESphFPeSYkLcLtTnSAg",
            width: "18px",
            height: "18px"
          }
        }

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

        search.sources.push({
          layer: pollingDivisions,
          searchFields: ["ED_NAMEE"],
          displayField: ["ED_NAMEE"],
          exactMatch: false,
          outFields: ["ED_NAMEE", "ED_NAMEF"],
          resultGraphicEnabled: true,
          name: "Polling Divisons",
          placeholder: "Example: Thornhill",
        });

        var pollingStations = new FeatureLayer({
          url: "https://services.arcgis.com/txWDfZ2LIgzmw5Ts/arcgis/rest/services/Federal_Polling_Stations/FeatureServer/0",
          renderer: pollingStationsRenderer,
          labelingInfo: [pollingStationsLabels]
        });

        map.add(pollingStations);

        // Create a variable referencing the checkbox node
        var pollingLayerToggle = document.getElementById("pollingLayer") as HTMLInputElement;

        console.log(pollingLayerToggle);

        // Listen to the change event for the checkbox
        pollingLayerToggle.addEventListener("change", function() {
          // When the checkbox is checked (true), set the layer's visibility to true
   //       pollingStations.visible = pollingLayerToggle.checked;
        });

        view.popup.autoOpenEnabled = false;
        view.on("click", function (event) {
          // Get the coordinates of the click on the view
          // around the decimals to 3 decimals
          var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
          var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;

          view.popup.open({
            // Set the popup's title to the coordinates of the clicked location
            title: "Reverse geocode: [" + lon + ", " + lat + "]",
            location: event.mapPoint // Set the location of the popup to the clicked location
          });

          var params = {
            location: event.mapPoint
          };

          // Execute a reverse geocode using the clicked location
          locatorTask
            .locationToAddress(params)
            .then(function (response) {
              // If an address is successfully found, show it in the popup's content
              view.popup.content = response.address;
            })
            .catch(function (error) {
              // If the promise fails and no result is found, show a generic message
              view.popup.content = "No address was found for this location";
            });
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

}
