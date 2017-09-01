import { Component, OnInit } from '@angular/core';
import { LocationService } from '../services/locations.service';
import { Helper } from '../services/helper.service';

@Component({
    templateUrl: './app/locations/locations.component.html',
    providers: [ LocationService, Helper ]
})

export class LocationsComponent implements OnInit {
    private sub: any;
    private locations: any;
    
    constructor(private locationService: LocationService,
                private helper: Helper) {}
    
    locationPromise = new Promise((resolve, reject) => {
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
}