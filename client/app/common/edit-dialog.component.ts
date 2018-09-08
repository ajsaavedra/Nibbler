import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { EditDialogService } from '../services/edit-dialog.service';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocationService } from '../services/locations.service';
import { GeocodingService } from '../services/geocoding.service';
import { Router } from '@angular/router';
import { CacheService } from '../services/cache.service';

@Component({
    selector: 'nibbler-edit-dialog-component',
    templateUrl: './app/common/edit-dialog.component.html'
})

export class EditDialogComponent implements OnInit, OnDestroy {
    @ViewChild('nibblerModal') openModal: ElementRef;

    private isActive: boolean;
    private subscriptions = [];
    private timesArray = [];
    private timesObject = [];
    private editLocationForm;
    private error: string;

    @Input() control: AbstractControl;
    @Input() location;

    constructor(
        private dialog: EditDialogService,
        public element: ElementRef,
        private fb: FormBuilder,
        private router: Router,
        private geocodingService: GeocodingService,
        private locationService: LocationService,
        private cacheService: CacheService
    ) {
        this.editLocationForm = fb.group({
            'name': [null, Validators.required],
            'address': [null, Validators.required]
        });
    }

    ngOnInit() {
        this.subscriptions.push(
            this.dialog.activeEmitter.subscribe(status => {
                this.isActive = status;
                if (this.isActive) { this.openModal.nativeElement.click(); }
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.dialog.toggleActive(false);
    }

    editLocation() {
        if (this.timesArray.length === 0 || this.timesObject.length === 0) {
            this.error = `Please include the hours for ${this.location.name}`;
            return;
        }
        this.error = '';
        this.geocodingService.getGeoLocation(this.editLocationForm.get('address').value).then(fulfilled => {
            const result = fulfilled.results[0];
            const lat = result.position.lat;
            const lng = result.position.lon;
            this.subscriptions.push(
                this.locationService.editLocation(
                    this.location._id, this.editLocationForm.get('name').value,
                    this.editLocationForm.get('address').value, lat, lng, this.timesObject)
                .subscribe(res => window.location.reload(), err => this.error = err.message)
            );
        })
        .catch(() => this.error = 'Your update could not be processed. Please try again later.');
    }
}
