import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Helper } from '../services/helper.service';
import { GeocodingService } from '../services/geocoding.service';
import { LocationService } from '../services/locations.service';
import { TokenService } from '../services/token.service';
import { DialogService } from '../services/dialog.service';

@Component({
    templateUrl: './app/locations/location-add.component.html',
    providers: [ Helper, GeocodingService ]
})

export class LocationAddComponent implements OnInit, OnDestroy {
    private timesArray: string[] = [];
    private timesObject: Object[] = [];
    private isLoggedIn: boolean;
    private addLocationForm: FormGroup;
    private addSubscription;

    private formIcon = require('../../assets/images/file.svg');

    constructor(private fb: FormBuilder,
                private router: Router,
                private locationService: LocationService,
                private geocodingService: GeocodingService,
                private tokenService: TokenService,
                private dialog: DialogService) {
        this.addLocationForm = fb.group({
            'name': [null, Validators.required],
            'address': [null, Validators.required]
        });
    }

    ngOnInit() {
        this.isLoggedIn = this.tokenService.tokenExists();
        if (!this.isLoggedIn) {
            this.router.navigateByUrl('/');
        }
    }

    ngOnDestroy() {
        this.addSubscription.unsubscribe();
        this.dialog.toggleActive(false);
    }

    getAddressCoordinates() {
        if (this.timesArray.length === 0) {
            this.dialog.setMessage('You must include a location\'s hours of operation.');
            this.dialog.toggleActive(true);
            return;
        }
        this.geocodingService
            .getGeoLocation(this.addLocationForm.get('address').value)
            .then(fulfilled => {
                const result = fulfilled.results[0];
                const lat = result.position.lat;
                const lng = result.position.lon;
                this.addSubscription = this.locationService
                    .addLocation(
                        this.addLocationForm.get('name').value,
                        this.addLocationForm.get('address').value,
                        lat, lng, this.timesObject
                    )
                    .subscribe(() => this.router.navigateByUrl('/locations'));
            })
            .catch(() => {
                this.dialog.setMessage('Sorry, it looks like something went wrong with your request.');
                this.dialog.toggleActive(true);
            });
    }
}
