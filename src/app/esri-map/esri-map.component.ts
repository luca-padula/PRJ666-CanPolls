import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { loadModules } from 'esri-loader';
import esri = __esri;

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
      "esri/layers/FeatureLayer"
    ])
      .then(([Locator, EsriMap, EsriMapView, FeatureLayer]) => {
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
          zoom: 17,
          map: map
        });

        var pollingDivisionsLabels = {
          symbol: {
            type: "text",
            color: "#FFFFFF",
            haloColor: "#000000",
            haloSize: "2px",
            font: {
              size: "18px",
              family: "Noto Sans",
              style: "italic",
              weight: "normal"
            }
          },
          //labelPlacement: "above-center",
          labelExpressionInfo: {
            expression: "return $feature[\"pd_num\"] + ' - ' + $feature[\"poll_name\"];"
          }
        };

        var pollingDivisions = new FeatureLayer({
          url: "https://services8.arcgis.com/oJlq1EXvPtMkmTJA/arcgis/rest/services/Canada_Polling_Divisions_2019/FeatureServer/0",
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
            color: "#0000A0",
            //haloColor: "#0000A0",
            //haloSize: "1px",
            font: {
              size: "10px",
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
          renderer: pollingStationsRenderer,
          labelingInfo: [pollingStationsLabels]
        });

        map.add(pollingStations);


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
