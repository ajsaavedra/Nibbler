import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Helper } from '../services/helper.service';
import { GeocodingService } from '../services/geocoding.service';
import { LocationService } from '../services/locations.service';
import { GlobalEventsManager } from '../GlobalEventsManager';

@Component({
    templateUrl: './app/locations/location-add.component.html',
    providers: [ Helper, GeocodingService ]
})

export class LocationAddComponent implements OnInit {
    private openingHour: string;
    private openingMeridian: string;
    private closingHour: string;
    private closingMeridian: string;
    private openingDay: string;
    private timesArray: string[] = [];
    private timesObj: Object[] = [];
    private hours: number[];
    private days: string[];
    private isLoggedIn: boolean;
    private addLocationForm: FormGroup;

    private formIcon = require('../../assets/images/file.svg');

    constructor(private fb: FormBuilder,
                private helper: Helper,
                private router: Router,
                private locationService: LocationService,
                private geocodingService: GeocodingService,
                private globalEventsManager: GlobalEventsManager) {
        this.addLocationForm = fb.group({
            'name': [null, Validators.required],
            'address': [null, Validators.required],
            'gluten-free': false,
            'vegan': false,
            'vegetarian': false,
            'soy-free': false,
            'nut-free': false
        });

        this.hours = this.helper.timePicker();
        this.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    }

    ngOnInit() {
        this.isLoggedIn = this.globalEventsManager.getUserProfiletab() && true;
        if (!this.isLoggedIn) {
            this.router.navigateByUrl('/');
        }
    }

    updateOpeningDay(day) {
        this.openingDay = day;
    }

    updateOpeningHour(hour) {
        this.openingHour = hour;
    }

    updateClosingHour(hour) {
        this.closingHour = hour;
    }

    updateOpeningMeridian(meridian) {
        this.openingMeridian = meridian;
    }

    updateClosingMeridian(meridian) {
        this.closingMeridian = meridian;
    }

    addTime() {
        if (this.openingDay && this.openingDay !== 'Day' &&
            this.openingHour && this.openingHour !== 'Open' &&
            this.closingHour && this.closingHour !== 'Close' &&
            this.openingMeridian && this.openingMeridian !== 'AM/PM' &&
            this.closingMeridian && this.closingMeridian !== 'AM/PM') {
            const time = this.openingDay + ' ' + this.openingHour +
                       this.openingMeridian + ' to ' + this.closingHour + this.closingMeridian;
            this.timesArray.push(time);
            this.timesObj.push({
                day: this.openingDay,
                opening: this.openingHour,
                closing: this.closingHour
            });
        }
    }

    removeHours() {
        this.timesArray.pop();
    }

    formatOptions() {
        return {
           'gluten_free': this.addLocationForm.get('gluten-free').value,
            'vegan': this.addLocationForm.get('vegan').value,
            'vegetarian': this.addLocationForm.get('vegetarian').value,
            'soy_free': this.addLocationForm.get('soy-free').value,
            'nut_free': this.addLocationForm.get('nut-free').value
        };
    }

    getAddressCoordinates() {
        if (this.timesArray.length === 0) {
            alert('You must include a location\'s hours of operation.');
            return;
        }
        this.geocodingService
            .getGeoLocation(this.addLocationForm.get('address').value)
            .then(fulfilled => {
                const result = fulfilled.results[0];
                const lat = result.geometry.location.lat;
                const lng = result.geometry.location.lng;
                const options = this.formatOptions();
                this.locationService
                    .addLocation(
                        this.addLocationForm.get('name').value,
                        this.addLocationForm.get('address').value,
                        lat, lng, this.timesObj, options
                    )
                    .subscribe(results => this.router.navigateByUrl('/locations'));
            })
            .catch(err => {
                 alert('Sorry, it looks like something went wrong with your request.');
            });
    }
}
