import { Component, Input } from '@angular/core';
import { Helper } from '../services/helper.service';

@Component({
    selector: 'nibbler-location-hours-component',
    template: `
        <div class="col" *ngFor="let time of timesArray">{{ time }}</div>
        <div class="row add-time-row">
            <nibbler-select-control-component [onChange]="updateOpeningDay.bind(this)" label="Day" [list]="days">
            </nibbler-select-control-component>
            <nibbler-select-control-component [onChange]="updateOpeningHour.bind(this)" label="Open" [list]="hours">
            </nibbler-select-control-component>
            <nibbler-select-control-component [onChange]="updateOpeningMeridian.bind(this)" label="AM/PM" [list]="['am','pm']">
            </nibbler-select-control-component>
            <nibbler-select-control-component [onChange]="updateClosingHour.bind(this)" label="Close" [list]="hours">
            </nibbler-select-control-component>
            <nibbler-select-control-component [onChange]="updateClosingMeridian.bind(this)" label="AM/PM" [list]="['am','pm']">
            </nibbler-select-control-component>
            <div id="time-btns">
                <button class="btn time-btn" (click)="addTime()">
                    <i class="fa fa-plus"></i>
                </button>
                <button class="btn submit-btn" (click)="removeHours()">
                    <i class="fa fa-minus"></i>
                </button>
            </div>
        </div>
    `
})

export class LocationHoursComponent {
    @Input() timesArray;
    @Input() timesObject;

    private openingDay;
    private openingHour;
    private closingHour;
    private openingMeridian;
    private closingMeridian;
    private hours;
    private days;

    constructor(private helper: Helper) {
        this.hours = this.helper.timePicker();
        this.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
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
            this.timesObject.push({
                day: this.openingDay,
                opening: this.openingHour + this.openingMeridian,
                closing: this.closingHour + this.closingMeridian,
            });
        }
    }

    removeHours() {
        this.timesArray.pop();
        this.timesObject.pop();
    }
}
