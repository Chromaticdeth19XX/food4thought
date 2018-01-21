import { Component, OnInit } from '@angular/core';
import { MapService } from './map.service';
import { NgForm } from "@angular/forms";
import * as mapboxgl from 'mapbox-gl';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import { SITES } from '../assets/temp_sites'
import { UserLocation } from "./userLocation";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userLoc : UserLocation = new UserLocation();
  mapToken : String;
  script: String;
  mealSites: any;
  map:mapboxgl.Map;
  mapService: MapService


  constructor(private _mapService: MapService) {
    // this.mealSites = this._mapService.mealSites;
  }

  ngOnInit(){


    (mapboxgl as any).accessToken = this._mapService.mapToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/vicagbasi/cjcjqksly12r62rloz0ps1xmm'

    });
    // This little number loads the data points onto the map :)
    console.log(this._mapService)
    this.map.on('load', (e)=> {
      this._mapService.getAllSites().then((geoData)=>{

      // Add the data to your map as a layer with embedded fork and knife!
      // **************************************************
      this.mealSites = geoData.json();
      this.map.addLayer({
        id: 'locations',
        type: 'symbol',
        // Add a GeoJSON source containing place coordinates and information.
        source: {
          type: 'geojson',

          //this is the hard coded data points...
          // this should be 'this.mealSites' if the data came through correctly :/
          data: this.mealSites
        },
        layout: {
          'icon-image': 'restaurant-15',
          'icon-allow-overlap': true,
        }
      });
      // **************************************************
      // ADDING CUSTOM MARKERS: THIS CHANGING THE FORK AND KNIFE IMAGE TO SOMETHING UNIQUE
      // map.addSource('places', {
      //   type: 'geojson',
      //   data: SITES
      // });
      this.buildLocationList(SITES);

      // **************************************************
      // MAP FINISHED LOADING
    });


    // Add zoom and rotation controls to the map.
    this.map.addControl(new mapboxgl.NavigationControl());
        }
  }

  buildLocationList(data) {
    // Iterate through the list of stores
    
    for (let i = 0; i < data.features.length; i++) {
      var currentFeature = data.features[i];
      // Shorten data.feature.properties to just `prop` so we're not
      // writing this long form over and over again.
      var prop = currentFeature.properties;
      // Select the listing container in the HTML and append a div
      // with the class 'item' for each store
      var listings = document.getElementById('listings');
      var listing = listings.appendChild(document.createElement('div'));
      listing.className = 'item';
      listing.id = 'listing-' + i;

      // Create a new link with the class 'title' for each store
      // and fill it with the store address
      var link = listing.appendChild(document.createElement('a'));
      link.href = '#';
      link.className = 'title';
      //link.dataPosition = i;
      link.innerHTML = prop["Name"];

      // Create a new div with the class 'details' for each store
      // and fill it with the city and phone number
      var details = listing.appendChild(document.createElement('div'));
      details.innerHTML = prop["City"];
      if (prop["Phone"]) {
        details.innerHTML += ' &middot; ' + prop["Phone"] + '<hr>';
      }
    }
  }
}
