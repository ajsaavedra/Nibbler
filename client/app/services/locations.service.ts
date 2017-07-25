import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class LocationServiceComponent {
    API_URL: string = 'http://localhost:3000/api/locations';
    headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: this.headers });
    constructor(private http: Http) {}

    getNearbyLocations() {
        return this.http.get(this.API_URL + '?lng=-122.2903&lat=37.8687&maxDistance=2').map(res => res.json());
    }

    getLocationById(id) {
        return this.http.get(this.API_URL + '/' + id).map(res => res.json());
    }
}