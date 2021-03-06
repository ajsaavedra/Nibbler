import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from '../services/locations.service';
import { CacheService } from '../services/cache.service';
import { Helper } from '../services/helper.service';
import { TokenService } from '../services/token.service';

@Component({
    templateUrl: './app/accounts/profile.reviews.component.html',
    providers: [ Helper ]
})

export class ProfileReviewsComponent implements OnInit, OnDestroy {
    private username;
    private subscriptions = [];
    private reviews = [];

    constructor(
        private locationService: LocationService,
        private cacheService: CacheService,
        private helper: Helper,
        private route: ActivatedRoute,
        private router: Router,
        private tokenService: TokenService
    ) {}

    ngOnInit() {
        const sub = this.route.params
            .map(params => params['username'])
            .switchMap(uname => {
                this.username = uname;
                return this.locationService.getLocationReviewsByAuthor(this.username);
            })
            .subscribe(res => {
                Object.keys(res).forEach(review => {
                    res[review]['location_id'] = review.split(':')[0];
                    res[review]['location_name'] = review.split(':')[1];
                    this.reviews.push(res[review]);
                });
            }, err => {
                this.router.navigateByUrl('/');
            });
        this.subscriptions.push(sub);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    getTimeSince(datetime) {
        return this.helper.getTimeSince(datetime);
    }

    starRating = function(rating) {
        return this.helper.starRating(rating);
    };

    belongsToUser(review) {
        return review.author === this.tokenService.getUsername();
    }

    deleteReview(location_id, review_id) {
        const sub = this.locationService.deleteUserLocationReview(location_id, review_id)
            .switchMap(res => {
                if (!this.cacheService._data['location'][location_id]) {
                    this.cacheService.getLocationById(location_id);
                }
                return this.cacheService._data['location'][location_id];
            })
            .subscribe(res => {
                res['reviews'] = res['reviews'].filter(review => review._id !== review_id);
                this.reviews = this.reviews.filter(review => review._id !== review_id);
            });
        this.subscriptions.push(sub);
    }
}
