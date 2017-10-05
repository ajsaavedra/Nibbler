import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import config = require('../../../config/secret');

@Injectable()
export class GeocodingService {
    private API_URL: string = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    private API_KEY: string = '&key=' + config.geocodingKey;
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http) {}
    
    public updateUserLocation(address: string) {
        const request = this.API_URL + address.split(' ').join('+') + this.API_KEY;
        return this.http.get(request)
                        .map(res => res.json())
                        .catch(err => Observable.throw(err) || 'Server error')
                        .toPromise();
    }
}