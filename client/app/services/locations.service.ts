import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { TokenService } from './token.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class LocationService {
    API_URL = 'http://localhost:3000/api/locations';
    headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: this.headers, withCredentials: true });
    constructor(private http: Http, private tokenService: TokenService) {}

    getNearbyLocations(limit: number, offset: number = 0, lon: number = -122.2903, lat: number = 37.8687) {
        return this.http.get(`${this.API_URL}?lng=${lon}&lat=${lat}&maxDistance=5&limit=
            ${limit}&offset=${offset}`, this.options).map(res => res.json());
    }

    getLocationsByLatitudeAndLongitude(lat: number, lng: number) {
        return this.http.get(`${this.API_URL}?lng=${lng}&lat=${lat}&maxDistance=5`, this.options).map(res => res.json());
    }

    getLocationById(id) {
        return this.http.get(this.API_URL + '/' + id, this.options).map(res => res.json());
    }

    getLocationReviewsByAuthor(uname) {
        return this.http.get(this.API_URL + '-get-user-reviews/' + uname, this.options).map(res => res.json());
    }

    deleteUserLocationReview(id, reviewid) {
        return this.http.delete(`${this.API_URL}/${id}/reviews/${reviewid}`, this.tokenService.getAuthorizedHeaderOptions())
                        .map(res => res.json());
    }

    addReviewToLocation(id, author, title, rating, review) {
        const body = { author, title, rating, review };

        return this.http.post(`${this.API_URL}/${id}/reviews`, body, this.tokenService.getAuthorizedHeaderOptions())
                        .map(res => res.json());
    }

    addLocation(name, address, lat, lng, hours) {
        const body = { name, address, lng, lat, hours };
        return this.http.post(this.API_URL, body, this.tokenService.getAuthorizedHeaderOptions()).map(res => res.json());
    }

    editLocation(id, name, address, lat, lng, hours) {
        const body = { name, address, lng, lat, hours };
        return this.http.put(`${this.API_URL}/${id}`, body, this.tokenService.getAuthorizedHeaderOptions()).map(res => res.json());
    }
}
