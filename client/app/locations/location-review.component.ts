import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocationService } from '../services/locations.service';

@Component({
    selector: 'location-review-form',
    templateUrl: './app/locations/location-review.component.html',
    providers: [ LocationService ]
})

export class LocationReviewComponent {
    @Input() location: any;

    reviewForm: FormGroup;

    constructor(private locationService: LocationService, private fb: FormBuilder) {
        this.reviewForm = fb.group({
            'title': [null, Validators.required],
            'rating': [5, Validators.required],
            'review': [null, Validators.required]
        })
    }

    addReview(id) {
        return new Promise((resolve, reject) => {
            const call = this.locationService
                .addReviewToLocation(
                    id,
                    this.reviewForm.get('title').value,
                    this.reviewForm.get('rating').value,
                    this.reviewForm.get('review').value)
                .subscribe(results => resolve(results));
        });
    }

    submitReview() {
        this.addReview(this.location._id)
        .then(result => window.location.reload())
        .catch(err => console.log('Error: ' + err))
    }
}