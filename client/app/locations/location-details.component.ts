import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocationService } from '../services/locations.service';
import { Helper } from '../services/helper.service';
import { CacheService } from '../services/cache.service';

@Component({
    templateUrl: './app/locations/location-details.component.html',
    providers: [ LocationService, Helper ]
})

export class LocationDetailsComponent implements OnInit, OnDestroy {
    private sub: any;
    private location: any;
    private isLoggedIn: boolean;

    constructor(private locationService: LocationService,
                private cacheService: CacheService,
                private helper: Helper,
                private route: ActivatedRoute) {}

    ngOnInit() {
        this.sub = this.route.params
            .map(params => params['id'])
            .switchMap(id => {
                if (id !== null && id !== undefined) {
                    if (!this.cacheService._data['location'] ||
                        !this.cacheService._data['location'][id]) {
                            this.cacheService.getLocationById(id);
                    }
                    return this.cacheService._data['location'][id];
                }
            })
            .subscribe(data => {
                this.location = data;
            });

        this.isLoggedIn = localStorage.getItem('username') && true;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    starRating = function(rating) {
        return this.helper.starRating(rating);
    };

    formatDate = function(date) {
        let str, formattedDate;
        formattedDate = new Date(date);
        str = this.getMonthString(formattedDate.getMonth()) + ' ' +
            formattedDate.getDay() + ', ' +
            formattedDate.getFullYear();
        return str;
    };

    getMonthString = function(month) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[month - 1];
    };
}
