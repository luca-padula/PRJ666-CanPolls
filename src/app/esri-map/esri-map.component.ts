// Look at ArcGISDynamicMapServiceLayer

import { Component, OnInit, ViewChild, ElementRef, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { loadModules } from 'esri-loader';
import { bindCallback } from 'rxjs';
//import { Polygon } from 'esri/geometry';
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

        view.ui.add(compass, "top-left");
        view.ui.add(locateWidget, "top-left");

        // var federalLayerLabels = {
        //   symbol: {
        //     type: "text",
        //     color: "#FFFFFF",
        //     haloColor: "#000000",
        //     haloSize: "2px",
        //     font: {
        //       size: "36px",
        //       family: "Noto Sans",
        //       style: "italic",
        //       weight: "normal"
        //     }
        //   },
        //   //labelPlacement: "above-center",
        //   labelExpressionInfo: {
        //     expression: "return $feature[\"ed_namee\"];"
        //   }
        // };
        
        var generalBoundaries = new FeatureLayer({
          url: "https://webservices.maps.canada.ca/arcgis/rest/services/ELECTIONS/federal_electoral_districts_boundaries_2015_en/MapServer/0",
          // labelingInfo: [federalLayerLabels],
          // renderer: politicalColorRenderer,
          opacity: 0.40,
          outFields: ["*"],
          // popupTemplate: {
          //   title: "<b>{name}</b>",
          //   outFields: ["*"],
          //   // content: queryDivisionInformation
          // }
        });

        map.add(generalBoundaries);

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

        var federalLayer = new FeatureLayer({
          url: "https://services5.arcgis.com/yhL5dRej97QO0Sj3/arcgis/rest/services/Federal_Election_Results_2019/FeatureServer/0",
          // labelingInfo: [federalLayerLabels],
          renderer: politicalColorRenderer,
          opacity: 0.40,
          outFields: ["*"],
          popupTemplate: {
            title: "<b>{name}</b>",
            outFields: ["*"],
            content: queryDivisionInformation
          }
        });

        map.add(federalLayer);

        var provincialBC = new FeatureLayer({
          url: "https://services.arcgis.com/zmLUiqh7X11gGV2d/ArcGIS/rest/services/BC2017/FeatureServer/0",
          // renderer: politicalColorRenderer,
          opacity: 0.40,
          outFields: ["*"],
          popupTemplate: {
            title: "<b>{ED_NAME}</b>",
            outFields: ["*"],
            // content: queryDivisionInformation
          },
          visible: false,
          title: "BC"
        });

        var provincialON = new FeatureLayer({
          url: "https://services5.arcgis.com/yhL5dRej97QO0Sj3/arcgis/rest/services/Ontario2018Time/FeatureServer/0",
          // renderer: politicalColorRenderer,
          opacity: 0.40,
          outFields: ["*"],
          popupTemplate: {
            title: "<b>{ENGLISH_NA}</b>",
            outFields: ["*"],
            // content: queryDivisionInformation
          },
          visible: false,
          title: "ON"
        });

        var provincialNB = new FeatureLayer({
          url: "https://services5.arcgis.com/yhL5dRej97QO0Sj3/arcgis/rest/services/ElectionResults2018/FeatureServer/0",
          // renderer: politicalColorRenderer,
          opacity: 0.40,
          outFields: ["*"],
          popupTemplate: {
            title: "<b>{ElectionResults2018_PED_Name_E}</b>",
            outFields: ["*"],
            // content: queryDivisionInformation
          },
          visible: false,
          title: "NB"
        });

        var provincialSK = new FeatureLayer({
          url: "https://services.arcgis.com/zmLUiqh7X11gGV2d/arcgis/rest/services/Saskatchewan_2016/FeatureServer/0",
          // renderer: politicalColorRenderer,
          opacity: 0.40,
          outFields: ["*"],
          popupTemplate: {
            title: "<b>{ElectoralDistrictName}</b>",
            outFields: ["*"],
            // content: queryDivisionInformation
          },
          visible: false,
          title: "SK"
        });

        let provincialLayers = [provincialBC, provincialON, provincialNB, provincialSK];

        provincialLayers.forEach(layer => {
          map.add(layer);
        });

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

        // Search widget
        // Do not include the default map search
        var search = new Search({
          view: view,
          allPlaceholder: "Polling Division or Station",
          sources: [
            {
              layer: federalLayer,
              searchFields: ["name"],
              displayField: "name",
              exactMatch: false,
              outFields: ["name", "provcode"],
              resultGraphicEnabled: true,
              name: "Polling Divisons",
              placeholder: "Example: Thornhill"
            },
            {
              layer: pollingStations,
              searchFields: ["site_name"],
              displayField: "site_name",
              outFields: ["*"],
              name: "Polling Stations",
              placeholder: "Example: Sunrise of Thornhill"
            }
          ]
        });

        view.ui.add(search, "top-right");

        // var pollingStationsRenderer = {
        //   type: "simple",
        //   symbol: {
        //     type: "picture-marker",
        //     url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRRjHnt5ly0y4GQBASsI0cYKvNuU5sjJfESphFPeSYkLcLtTnSAg",
        //     width: "18px",
        //     height: "18px"
        //   }
        // }

        ///////////////////////////////////
        // FILTER OPTION EVENT LISTENERS //
        ///////////////////////////////////

        let resultsTable = document.getElementById("resultsTable") as HTMLTableElement;

        function clearResults() {
          resultsTable.innerHTML = "";
          view.popup.close();
        }

        function checkProvincial(province) {
          provincialLayers.forEach(layer => {
            if (((<HTMLInputElement>document.getElementById("provincial")).checked) && province == layer.title) {
              layer.visible = true;
              view.goTo(layer.fullExtent);
            } else {
              layer.visible = false;
            }
            
          });
        }

        var provinces = document.getElementById("provincialSelection");
        provinces.addEventListener("change", function () {
          checkProvincial((<HTMLInputElement>this).value);
        });

        // Retrieve all region type radio buttons
        var regionType = document.getElementsByName("regionType");
        regionType.forEach(element => {
          element.addEventListener("click", function () {
            if ((<HTMLInputElement>element).value == "provincial") {
              provincialLayers.forEach(layer => {
                layer.visible = false;
              });
            }

            checkProvincial((<HTMLInputElement>provinces).value);

            federalLayer.visible = (<HTMLInputElement>element).value == "federal";

            if (federalLayer.visible == true) {
              // Not working?
              view.goTo(federalLayer.fullExtent);
            }
            clearResults();
          });
        });

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

          var query = federalLayer.createQuery();
          query.where = "OBJECTID = " + target.graphic.attributes.OBJECTID;
          query.outFields = ["*"];

          return federalLayer.queryFeatures(query)
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
