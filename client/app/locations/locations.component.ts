import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocationService } from '../services/locations.service';
import { GeocodingService } from '../services/geocoding.service';
import { Helper } from '../services/helper.service';

@Component({
    templateUrl: './app/locations/locations.component.html',
    providers: [ LocationService, GeocodingService, Helper ]
})

export class LocationsComponent implements OnInit, OnDestroy {
    private sub: any;
    private locations: any;
    private locationSearchItem: string;
    
    constructor(private locationService: LocationService,
                private geocodingService: GeocodingService,
                private helper: Helper) {}
    
    private locationPromise = new Promise((resolve, reject) => {
        this.sub = this.locationService.getNearbyLocations().subscribe(results => {
            this.locations = results;
        });
        if (this.locations) {
            resolve(this.locations);
        }
    });

    getNearbyLocations() {
        this.locationPromise
        .then((fulfilled) => {
            console.log(fulfilled);
        })
        .catch((err) => {
            console.log(err.message);
        })
    }

    starRating = function(rating) {
        return this.helper.starRating(rating);
    };

    ngOnInit() {
        this.getNearbyLocations();
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    searchLocation() {
        this.geocodingService
            .updateUserLocation(this.locationSearchItem)
            .then(fulfilled => {
                const result = fulfilled.results[0];
                const lat = result.geometry.location.lat;
                const lng = result.geometry.location.lng;
                this.locationService
                    .getLocationsByLatitudeAndLongitude(lat, lng)
                    .subscribe(results => this.locations = results);
            })
            .catch(err => {
                console.log(err.message);
            });
    }

    keystrokeListener() {
        if (this.locationSearchItem && this.locationSearchItem.length > 0) {
            this.searchLocation();
        }
    }
}
