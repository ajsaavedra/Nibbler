import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TokenService } from './token.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AccountsService {
    private API_URL = 'http://localhost:3000/api/users';
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private options = new RequestOptions({ headers: this.headers, withCredentials: true });

    constructor(private http: Http, private tokenService: TokenService) {}

    checkIfUserExists(email, uname) {
        return this.http.get(`${this.API_URL}/${email}/${uname}`)
                        .map(res => res.json())
                        .catch(err => Observable.throw(err) || 'Server error');
    }

    registerUser(firstname, lastname, username, email, password, latitude, longitude,
                gluten_free, vegan, vegetarian, nut_free, soy_free) {
        const body = {
            firstname, lastname, username, email, password, latitude, longitude,
            gluten_free, vegan, vegetarian, nut_free, soy_free
        };

        return this.http.post(this.API_URL + '/new', body)
                        .map(res => res.json())
                        .catch(err => Observable.throw(err) || 'Server error');
    }

    loginUser(username, password) {
        const body = { username, password };

        return this.http.post('http://localhost:3000/api/login', body, this.options)
                        .map(res => res.json())
                        .catch(err => Observable.throw(err) || 'Server error');
    }

    getUserProfile(uname) {
        return this.http.get(`${this.API_URL}/${uname}`, this.tokenService.getAuthorizedHeaderOptions())
                        .map(res => res.json())
                        .catch(err => Observable.throw(err) || 'Server error');
    }

    getUserSavedPosts() {
        return this.http.get('http://localhost:3000/api/saved-favorites/', this.tokenService.getAuthorizedHeaderOptions())
                        .map(res => res.json());
    }

    savePostToUser(uname, post_id) {
        const body = {
            username: uname,
            post_id: post_id
        };

        return this.http.post('http://localhost:3000/api/save/', body, this.tokenService.getAuthorizedHeaderOptions())
                        .map(res => res ? res.json() : {});
    }

    removePostFromUser(uname, post_id) {
        const body = {
            username: uname,
            post_id: post_id
        };

        return this.http.post('http://localhost:3000/api/unsave/', body, this.tokenService.getAuthorizedHeaderOptions())
                        .map(res => res ? res.json() : {});
    }

    saveLikedPostToUser(uname, post_id) {
        const body = {
            username: uname,
            post_id: post_id
        };

        return this.http.post('http://localhost:3000/api/like/', body, this.tokenService.getAuthorizedHeaderOptions())
                        .map(res => res ? res.json() : {});
    }

    removeLikedPostFromUser(uname, post_id) {
        const body = {
            username: uname,
            post_id: post_id
        };

        return this.http.post('http://localhost:3000/api/unlike/', body, this.tokenService.getAuthorizedHeaderOptions())
                        .map(res => res ? res.json() : {});
    }

    saveHelpfulComment(post_id, reply_id, helpful) {
        const body = {
            post_id: post_id,
            reply_id: reply_id,
            isHelpful: helpful
        };

        return this.http.post('http://localhost:3000/api/save-helpful-comment/', body, this.tokenService.getAuthorizedHeaderOptions())
                        .map(res => res ? res.json() : {});
    }

    getSavedHelpfulCommentsForPost(post) {

        return this.http.get(`http://localhost:3000/api/question-helpful-comments/${post}`,
                            this.tokenService.getAuthorizedHeaderOptions()).map(res => res.json());
    }

    getSavedHelpfulComments() {
        return this.http.get('http://localhost:3000/api/saved-helpful-comments/',
                            this.tokenService.getAuthorizedHeaderOptions()).map(res => res.json());
    }

    getLikedPosts() {
        return this.http.get('http://localhost:3000/api/liked-posts/', this.tokenService.getAuthorizedHeaderOptions())
                        .map(res => res.json());
    }

    getUnlikedPosts() {
        return this.http.get('http://localhost:3000/api/unliked-posts/', this.tokenService.getAuthorizedHeaderOptions())
                        .map(res => res.json());
    }
}
