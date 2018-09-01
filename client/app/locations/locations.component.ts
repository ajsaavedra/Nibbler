import { Component, OnInit, OnDestroy, Pipe } from '@angular/core';
import { LocationService } from '../services/locations.service';
import { GeocodingService } from '../services/geocoding.service';
import { Helper } from '../services/helper.service';
import { CacheService } from '../services/cache.service';
import { GlobalEventsManager } from '../GlobalEventsManager';
import { TokenService } from '../services/token.service';

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
                private tokenService: TokenService,
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
            if (this.tokenService.tokenExists()) {
                const location = this.tokenService.decodeToken()['coords'];
                this.cacheService.getLocations(limit, pg, location[0], location[1]);
            } else {
                this.cacheService.getLocations(limit, pg);
            }
            this.getCachedLocations();
        }));
        this.isLoggedIn = this.tokenService.tokenExists();
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
                const lat = result.position.lat;
                const lon = result.position.lon;
                this.locationService
                    .getLocationsByLatitudeAndLongitude(lat, lon)
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
