import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import config = require('../../../config/secret');

@Injectable()
export class GeocodingService {
    private API_URL = 'https://api.tomtom.com/search/2/geocode/';
    private API_KEY = '&key=' + config.geocodingKey;
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http) {}

    public getGeoLocation(address: string) {
        const request = `${this.API_URL}${address}.json?limit=1&countrySet=USA&${this.API_KEY}`;
        return this.http.get(request)
                        .map(res => res.json())
                        .catch(err => Observable.throw(err) || 'Server error')
                        .toPromise();
    }

    public getMapForLocation(lat: number, lon: number) {
        const url = 'https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/' +
            `pin-s+EA2A3C(${lon},${lat})/${lon},${lat},15.5,0,0auto/400x300@2x?access_token=${config.mapbox}`;
        return this.http.get(url).toPromise();
    }
}
