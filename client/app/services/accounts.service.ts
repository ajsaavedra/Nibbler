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

    getUserSavedPosts(uname) {
        return this.http.get('http://localhost:3000/api/saved-favorites/' + uname)
                        .map(res => res.json());
    }

    savePostToUser(uname, post_id) {
        const body = {
            username: uname,
            post_id: post_id
        };

        return this.http.post('http://localhost:3000/api/save/', body)
                        .map(res => res ? res.json() : {});
    }

    removePostFromUser(uname, post_id) {
        const body = {
            username: uname,
            post_id: post_id
        };

        return this.http.post('http://localhost:3000/api/unsave/', body)
                        .map(res => res ? res.json() : {});
    }

    saveLikedPostToUser(uname, post_id) {
        const body = {
            username: uname,
            post_id: post_id
        };

        return this.http.post('http://localhost:3000/api/like/', body)
                        .map(res => res ? res.json() : {});
    }

    removeLikedPostFromUser(uname, post_id) {
        const body = {
            username: uname,
            post_id: post_id
        };

        return this.http.post('http://localhost:3000/api/unlike/', body)
                        .map(res => res ? res.json() : {});
    }

    saveHelpfulComment(uname, post_id, reply_id, helpful) {
        const body = {
            username: uname,
            post_id: post_id,
            reply_id: reply_id,
            isHelpful: helpful
        };

        return this.http.post('http://localhost:3000/api/save-helpful-comment/', body)
                        .map(res => res ? res.json() : {});
    }

    getSavedHelpfulCommentsForPost(uname, post) {
        return this.http.get('http://localhost:3000/api/question-helpful-comments/' +
                            uname + '/' + post)
                        .map(res => res.json());
    }

    getSavedHelpfulComments(uname) {
        return this.http.get('http://localhost:3000/api/saved-helpful-comments/' + uname)
                        .map(res => res.json());
    }

    getLikedPosts(uname) {
        return this.http.get('http://localhost:3000/api/liked-posts/' + uname)
                        .map(res => res.json());
    }

    getUnlikedPosts(uname) {
        return this.http.get('http://localhost:3000/api/unliked-posts/' + uname)
                        .map(res => res.json());
    }
}
