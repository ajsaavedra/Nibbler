import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AccountsService {
    private API_URL = 'http://localhost:3000/api/users';
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http) {}

    checkIfUserExists(email, uname) {
        return this.http.get(this.API_URL + '/' + email + '/' + uname)
                        .map(res => res.json())
                        .catch(err => Observable.throw(err) || 'Server error');
    }

    registerUser(fname, lname, uname, email, pw, lat, lng, gf, vg, veg, nf, sf) {
        const body = {
            firstname: fname,
            lastname: lname,
            username: uname,
            email: email,
            password: pw,
            latitude: lat,
            longitude: lng,
            gluten_free: gf,
            vegan: vg,
            vegetarian: veg,
            nut_free: nf,
            soy_free: sf
        };

        return this.http.post(this.API_URL + '/new', body)
                        .map(res => res.json())
                        .catch(err => Observable.throw(err) || 'Server error');
    }

    loginUser(uname, pw) {
        const body = {
            username: uname,
            password: pw
        };

        return this.http.post(this.API_URL + '/' + uname, body)
                        .map(res => res.json())
                        .catch(err => Observable.throw(err) || 'Server error');
    }

    logoutUser() {
        return this.http.get(this.API_URL + '/logout')
                        .map(res => res.json())
                        .catch(err => Observable.throw(err) || 'Server error');
    }

    getUserProfile(uname) {
        return this.http.get(this.API_URL + '/' + uname)
                        .map(res => res.json())
                        .catch(err => Observable.throw(err) || 'Server error');
    }

    getUserSavedPosts(uname, post_id) {
        return this.http.get('http://localhost:3000/api/questions-favorite/' + uname + '/' + post_id)
                        .map(res => res.json());
    }

    savePostToUser(uname, post_id) {
        const body = {
            username: uname,
            postid: post_id
        };

        return this.http.post('http://localhost:3000/api/save/', body)
                        .map(res => res.json());
    }

    removePostFromUser(uname, post_id) {
        const body = {
            username: uname,
            postid: post_id
        };

        return this.http.post('http://localhost:3000/api/unsave/', body)
                        .map(res => res.json());
    }
}
