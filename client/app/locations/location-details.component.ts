import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocationServiceComponent } from '../services/locations.service';

@Component({
    templateUrl: './app/locations/location-details.component.html',
    providers: [ LocationServiceComponent ]
})

export class LocationDetailsComponent implements OnInit {
    private sub: any;
    private location: any;

    constructor(private locationService: LocationServiceComponent, 
                private route: ActivatedRoute) {}

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            
            let id = params['id'];

            this.locationService.getLocationById(id).subscribe(location => this.location = location);
        })
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    starRating(rating) {
        var stars = "";
        for (var i = 0; i < Math.floor(rating); i++) {
            stars += "<i class=\"fa fa-star\"></i>";
        }
        for (var i = Math.floor(rating); i < 5; i++) {
            stars += "<i class=\"fa fa-star-o\"></i>";
        }
        return stars;
    }

    formatDate = function(date) {
        var str, formattedDate;
        formattedDate = new Date(date);
        str = this.getMonthString(formattedDate.getMonth()) + " " +
            formattedDate.getDay() + ", " +
            formattedDate.getFullYear();
        return str;
    };

    getMonthString = function(month) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[month-1];
    }
}