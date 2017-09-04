import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AccountsService {
    API_URL: string = 'http://localhost:3000/api/users';
    headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: this.headers });
    constructor(private http: Http) {}

    registerUser(fname, lname, uname, email, pw) {
        const body = {
            firstname: fname,
            lastname: lname,
            username: uname,
            email: email,
            password: pw
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
                        .catch(err => Observable.throw(err) || 'Server error');;
    }

    getLoginStatus(uname) {
        return this.http.get(this.API_URL + '/' + uname)
                        .map(res => res.json())
                        .catch(err => Observable.throw(err) || 'Server error');
    }
}
