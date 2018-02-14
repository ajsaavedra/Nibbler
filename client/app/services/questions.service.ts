import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class QuestionService {
    API_URL = 'http://localhost:3000/api/questions';
    headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: this.headers });
    constructor(private http: Http) {}

    getAllQuestions() {
        return this.http.get(this.API_URL).map(res => res.json());
    }

    getQuestionById(id) {
        return this.http.get(this.API_URL + '/' + id).map(res => res.json());
    }
}
