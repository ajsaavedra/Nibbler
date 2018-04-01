import { Component, OnInit, OnDestroy, Pipe } from '@angular/core';
import { LocationService } from '../services/locations.service';
import { GeocodingService } from '../services/geocoding.service';
import { Helper } from '../services/helper.service';
import { CacheService } from '../services/cache.service';

@Component({
    templateUrl: './app/locations/locations.component.html',
    providers: [ LocationService, GeocodingService, Helper ]
})

export class LocationsComponent implements OnInit, OnDestroy {
    private sub: any;
    private locations: any;
    private locationSearchItem: string;
    private isLoggedIn: boolean;
    private filters: string[] = [];
    private currentFilter: string;
    private homeIcon = require('../../assets/images/home.svg');

    constructor(private locationService: LocationService,
                private geocodingService: GeocodingService,
                private cacheService: CacheService,
                private helper: Helper) {

        if (!this.cacheService._data['locations']) {
            this.cacheService.getLocations();
        }
    }

    onFilterChange(event) {
        const newFilter = event.target.value;

        if (this.filters.length > 0 && this.filters.includes(newFilter)) {
            this.filters = this.filters.filter(f => f !== newFilter);
        } else {
            this.filters.push(newFilter);
        }
        this.currentFilter = this.filters.join(' ');
    }

    starRating = function(rating) {
        return this.helper.starRating(rating);
    };

    ngOnInit() {
        this.sub = this.cacheService._data['locations'].subscribe(res => {
            this.locations = res;
        });
        this.isLoggedIn = localStorage.getItem('username') && true;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    searchLocation() {
        this.geocodingService
            .getGeoLocation(this.locationSearchItem)
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
