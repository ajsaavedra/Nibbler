import { Injectable } from '@angular/core';

@Injectable()
export class Helper {
    starRating = function(rating) {
        return new Array(5)
            .fill(undefined)
            .map((star, i) => {
                return  '<i class=' + (i < rating ? '"fas ' : '"far ') + 'fa-star"></i>';
            })
        .join('\n');
    };

    hourPicker = function() {
        return new Array(24).fill(undefined).map((item, index) => {
            return (index % 12) + 1;
        }).sort((a, b) => b - a );
    };

    timePicker = function() {
        return this.hourPicker().map((hour, index) => {
            return index % 2 === 0 ? hour + ':00' : hour + ':30';
        });
    };

    getTimeSince(datetime) {
        const seconds = Math.floor((new Date().getTime() / 1000) - (Date.parse(datetime) / 1000));
        let interval = Math.floor(seconds / 31536000);

        if (interval >= 1) {
            return interval > 1 ? interval + ' years' : interval + ' year';
        }
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            return interval > 1 ? interval + ' months' : interval + ' month';
        }
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
            return interval > 1 ? interval + ' days' : interval + ' day';
        }
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
            return interval > 1 ? interval + ' hours' : interval + ' hour';
        }
        interval = Math.floor(seconds / 60);
        if (interval >= 1) {
            return interval > 1 ? interval + ' minutes' : interval + ' minute';
        }
        return Math.floor(seconds) + ' seconds';
    }
}
