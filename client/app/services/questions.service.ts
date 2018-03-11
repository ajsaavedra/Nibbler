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

    getAllPopularQuestions() {
        return this.http.get(this.API_URL + '-by-popularity').map(res => res.json());
    }

    getResolvedQuestions() {
        return this.http.get(this.API_URL + '-resolved').map(res => res.json());
    }

    getQuestionById(id) {
        return this.http.get(this.API_URL + '/' + id).map(res => res.json());
    }

    postQuestionReply(id, uname, text) {
        const body = {
            questionid: id,
            username: uname,
            replyText: text
        };

        return this.http.post(this.API_URL + '/' + id, body).map(res => res.json());
    }

    deleteQuestionReply(question_id, reply_id) {
        return this.http.delete(this.API_URL + '-comment/' + question_id + '/' + reply_id).map(res => res.json());
    }

    updateQuestionVoteCount(id, num) {
        const body = {
            id: id,
            vote: num
        };
        return this.http.put(this.API_URL + '-update-vote', body).map(res => res ? res.json() : {});
    }
}
