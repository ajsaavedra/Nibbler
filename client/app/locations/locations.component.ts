import { Component, OnInit, OnDestroy, Pipe } from '@angular/core';
import { LocationService } from '../services/locations.service';
import { GeocodingService } from '../services/geocoding.service';
import { Helper } from '../services/helper.service';
import { CacheService } from '../services/cache.service';
import { GlobalEventsManager } from '../GlobalEventsManager';

@Component({
    templateUrl: './app/locations/locations.component.html',
    providers: [ LocationService, GeocodingService, Helper ]
})

export class LocationsComponent implements OnInit, OnDestroy {
    private subscriptions = [];
    private locations: any;
    private locationSearchItem: string;
    private isLoggedIn: boolean;
    private filters: string[] = [];
    private currentFilter: string;
    private homeIcon = require('../../assets/images/home.svg');

    constructor(private locationService: LocationService,
                private geocodingService: GeocodingService,
                private globalEventsManager: GlobalEventsManager,
                private cacheService: CacheService,
                private helper: Helper) {}

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
        this.subscriptions.push(this.globalEventsManager.pageResetEmitter.subscribe(pg => {
            const limit = this.globalEventsManager.getLimitNumber();
            this.cacheService.getLocations(limit, pg);
            this.getCachedLocations();
        }));
        this.isLoggedIn = this.globalEventsManager.getUserProfiletab() && true;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.globalEventsManager.setLimitNumber(10);
        this.globalEventsManager.setPageNumber(0);
    }

    getCachedLocations() {
        this.subscriptions.push(this.cacheService._data['locations'].subscribe(res => {
            if (res.length === 0) { return this.globalEventsManager.setPageNumber(0); }
            this.locations = res;
        }));
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

    onPageReset(page: number) {
        this.globalEventsManager.setPageNumber(page);
    }

    onLimitReset(limit: number) {
        this.globalEventsManager.setLimitNumber(limit);
    }
}
