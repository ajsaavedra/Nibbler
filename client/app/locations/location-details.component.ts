import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeocodingService } from '../services/geocoding.service';
import { Helper } from '../services/helper.service';
import { CacheService } from '../services/cache.service';
import { TokenService } from '../services/token.service';
import { DialogService } from '../services/dialog.service';
import { EditDialogService } from '../services/edit-dialog.service';

@Component({
    templateUrl: './app/locations/location-details.component.html',
    providers: [ GeocodingService, Helper ]
})

export class LocationDetailsComponent implements OnInit, OnDestroy {
    private sub: any;
    private location: any;
    private isLoggedIn: boolean;
    private map;

    constructor(private geocodingService: GeocodingService,
                private cacheService: CacheService,
                private helper: Helper,
                private route: ActivatedRoute,
                private tokenService: TokenService,
                private dialog: DialogService,
                private edit: EditDialogService) {}

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
                console.log('updating');
                this.location = data;
                this.geocodingService.getMapForLocation(this.location.coords[1], this.location.coords[0])
                    .then(img => { this.map = img['url']; });
                this.isLoggedIn = this.tokenService.tokenExists();
            });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        this.dialog.toggleActive(false);
    }

    toggleEditDialog() {
        if (this.isLoggedIn) {
            this.edit.toggleActive(true);
        } else {
            this.dialog.toggleActive(true);
            this.dialog.setMessage('You must be logged in to edit or review a location.');
        }
    }

    starRating = function(rating) {
        return this.helper.starRating(rating);
    };

    formatDate = function(date) {
        const formattedDate = new Date(date);
        return `${this.getMonthString(formattedDate.getMonth())} ${formattedDate.getDate()}, ${formattedDate.getFullYear()}`;
    };

    getMonthString = function(month) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[month];
    };
}
