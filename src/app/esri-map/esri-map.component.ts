// Look at ArcGISDynamicMapServiceLayer

import { Component, OnInit, ViewChild, ElementRef, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { loadModules } from 'esri-loader';
import { bindCallback } from 'rxjs';
import { Polygon } from 'esri/geometry';
import { $ } from 'protractor';
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
      "esri/request",
      "esri/Graphic"
    ])
      .then(([Locator, EsriMap, EsriMapView, FeatureLayer, Search, Compass, Locate, watchUtils, esriRequest, Graphic]) => {
        // Create a locator task using the world geocoding service
        const locatorTask = new Locator({
          url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
        });

        // Create the base map
        var map = new EsriMap({
          // basemap: 'dark-gray-vector'
          basemap: 'gray-vector'
        });

        // var mapOnLoad = map.on("load", function(){
        //   console.log("Here we go...");
        //   map.graphics.on("click", myGraphicsClickHandler);
        // });

        // function myGraphicsClickHandler(evt) {
        //   alert("User clicked on " + evt.graphic);
        // }


        // Create the map view that the map will start on
        const view = new EsriMapView({
          container: this.mapViewEl.nativeElement,
          center: [-106.3468, 56.1304],
          zoom: 3,
          map: map
        });

        // view.on("click", function(event){

        // });

        // Search widget
        // Do not include the default map search
        var search = new Search({ view: view, includeDefaultSources: false });

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

        // var pollingDivisions = new FeatureLayer({
        //   url: "https://services.arcgis.com/txWDfZ2LIgzmw5Ts/arcgis/rest/services/Federal_Electoral_Districts/FeatureServer/0",
        //   labelingInfo: [pollingDivisionsLabels],
        //   opacity: 0.50,
        //   outFields: ["*"],
        //   popupTemplate: {
        //     title: "<b>Polling Division:</b> {ED_NAMEE}",
        //     outFields: ["*"],
        //     // "content": "<b>FID:</b> {FID}<br><b>OBJECTID:</b> {OBJECTID}<br><b>FED_NUM:</b> {FED_NUM}<br><b>ED_ID:</b> {ED_ID}"
        //     content: queryDivisionInformation
        //   }
        // });

        function colorPoliticalRegion(value, color) {
          return {
            value: value,
            symbol: {
              type: "simple-fill",
              color: color,
              outline: {
                color: "black",
                width: 3
              }
            }
          };
        }
        var politicalColorRenderer = {
          type: "unique-value",
          field: "WinningParty",
          defaultSymbol: {
            type: "simple-fill",
            color: "gray"
          },
          uniqueValueInfos: [
            colorPoliticalRegion("Conservative Party of Canada", "blue"),
            colorPoliticalRegion("Liberal Party of Canada", "red"),
            colorPoliticalRegion("New Democratic Party", "orange"),
            colorPoliticalRegion("Green Party of Canada", "green"),
            colorPoliticalRegion("Bloc Québécois", "turquoise")
          ]
        };

        var pollingDivisions = new FeatureLayer({
          url: "https://services5.arcgis.com/yhL5dRej97QO0Sj3/arcgis/rest/services/Federal_Election_Results_2019/FeatureServer/0",
          // labelingInfo: [pollingDivisionsLabels],
          renderer: politicalColorRenderer,
          opacity: 0.50,
          outFields: ["*"],
          popupTemplate: {
            title: "<b>{name}</b>",
            outFields: ["*"],
            content: queryDivisionInformation
          }
        });

        map.add(pollingDivisions);

        // Add a layer search
        search.sources.push({
          layer: pollingDivisions,
          searchFields: ["name"],
          displayField: "name",
          exactMatch: false,
          outFields: ["name", "provcode"],
          resultGraphicEnabled: true,
          name: "Polling Divisons",
          placeholder: "Example: Thornhill",
        })

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
          pollingStations.visible = pollingLayerToggle.checked;
        });

        function queryDivisionInformation(target) {
          var resultsInfo = document.getElementById("resultsInfo");
          resultsInfo.innerHTML = "<table>";

          console.log("Number: ", target.graphic.attributes.OBJECTID);

          var query = pollingDivisions.createQuery();
          query.where = "OBJECTID = " + target.graphic.attributes.OBJECTID;
          query.outFields = ["*"];

          return pollingDivisions.queryFeatures(query)
            .then(function (response) {
              var requestURL = 'https://represent.opennorth.ca/boundaries/federal-electoral-districts/' + response.features[0].attributes.fednum + '/candidates/';

              var options = {
                query: {
                  f: 'json'
                },
                responseType: 'json'
              };

              return esriRequest(requestURL, options).then(function (response) {
                //console.log(response);
                console.log(requestURL);

                var representative = null;

                // Find the representative's name from using alias checking
                for (var field of target.graphic.layer.fields) {
                  if (target.graphic.attributes.WinningParty == field.alias) {
                    representative = eval('target.graphic.attributes.' + field.name);
                    break;
                  }
                }

                //var final_results = "<b>FID:</b> {FID}<br><b>OBJECTID:</b> {OBJECTID}<br><b>FED_NUM:</b> {FED_NUM}<br><b>ED_ID:</b> {ED_ID}";
                var final_results = "<b>Federal Electoral District Number:</b> {fednum}<br><b>Elected Party:</b> {WinningParty}";

                if (representative) {
                  final_results += "<br><b>Elected Representative:</b> " + representative;
                }

                let resultsTable = document.getElementById("resultsTable") as HTMLTableElement;
                resultsTable.innerHTML = "";

                for (var representative of response.data.objects) {
                  let resultsRow = resultsTable.insertRow(-1)

                  resultsRow.insertCell(-1);
                  resultsRow.append(document.createTextNode(representative.name));
                  resultsRow.append(document.createElement("br"));

                  let resultsPicture = document.createElement("img");
                  resultsPicture.setAttribute("src", representative.photo_url);
                  resultsRow.append(resultsPicture);

                  resultsRow.insertCell(-1);
                  resultsRow.append(document.createTextNode(representative.party_name));
                  resultsRow.append(document.createElement("br"));
                  resultsRow.append(document.createTextNode(representative.district_name));
                  resultsRow.append(document.createElement("br"));
                  resultsRow.append(document.createTextNode(representative.election_name));

                  if (representative.offices[0] && representative.offices[0].tel) {
                    resultsRow.append(document.createElement("br"));
                    resultsRow.append(document.createTextNode(representative.offices[0].tel));
                  }
                  
                  resultsRow.append(document.createElement("br"));
                  resultsRow.append(document.createTextNode(representative.email));

                  // resultsInfo.innerHTML += "<tr>";

                  // resultsInfo.innerHTML += "<td>" + representative.name;
                  // resultsInfo.innerHTML += "<br><a href='" + representative.personal_url + "' target='_blank'><img src='" + representative.photo_url + "'></a></td>";

                  // resultsInfo.innerHTML += "<td>" + representative.party_name + "<br>";
                  // resultsInfo.innerHTML += representative.district_name + "<br>";
                  // resultsInfo.innerHTML += representative.election_name + "<br>";

                  // if (representative.offices[0] && representative.offices[0].tel) {
                  //   resultsInfo.innerHTML += representative.offices[0].tel + "<br>";
                  // }
                  // resultsInfo.innerHTML += representative.email + "<br></td>";

                  // resultsInfo.innerHTML += "</tr>";
                }

                // resultsInfo.innerHTML += "</table>";

                return final_results;
              });
            });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
}
