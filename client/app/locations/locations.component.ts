import { Component, OnInit } from '@angular/core';
import { LocationServiceComponent } from '../services/locations.service';

@Component({
    templateUrl: './app/locations/locations.component.html',
    providers: [ LocationServiceComponent ]
})

export class LocationsComponent implements OnInit {
    private sub: any;
    private locations: any;
    
    constructor(private locationService: LocationServiceComponent) {}
    
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

    starRating(rating) {
        var stars = "";
        for (var i = 0; i < Math.floor(rating); i++) {
            stars += "<i class=\"fa fa-star\"></i>";
        }
        for (var i = Math.floor(rating); i < 5; i++) {
            stars += "<i class=\"fa fa-star-o\"></i>";
        }
        return stars;
    }

    ngOnInit() {
        this.getNearbyLocations();
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}