import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { TokenService } from './token.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class QuestionService {
    API_URL = 'http://localhost:3000/api/questions';
    headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: this.headers });
    constructor(private http: Http, private tokenService: TokenService) {}

    getAllQuestions(limit: number, offset: number = 0) {
        return this.http.get(this.API_URL + '/' + limit + '/' + offset).map(res => res.json());
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

    getQuestionsByAuthor(uname) {
        return this.http.get(this.API_URL + '-by-author/' + uname).map(res => res.json());
    }

    postUserQuestion(uname: string, title: string, question: string, tags: string[]) {
        const body = {
            user: uname,
            title: title,
            question: question,
            tags: tags
        };
        return this.http.post(this.API_URL, body, this.tokenService.getAuthorizedHeaderOptions()).map(res => res.json());
    }

    postQuestionReply(id, uname, text) {
        const body = {
            questionid: id,
            username: uname,
            replyText: text
        };

        return this.http.post(`${this.API_URL}/${id}`, body, this.tokenService.getAuthorizedHeaderOptions()).map(res => res.json());
    }

    editQuestionReply(question_id, reply_id, text) {
        const body = {
            text: text
        };
        return this.http.put(`${this.API_URL}-comment/${question_id}/${reply_id}`, body, this.tokenService.getAuthorizedHeaderOptions())
                        .map(res => res.json());
    }

    deleteQuestionReply(question_id, reply_id) {
        return this.http.delete(`${this.API_URL}-comment/${question_id}/${reply_id}`, this.tokenService.getAuthorizedHeaderOptions())
                        .map(res => res.json());
    }

    deleteQuestion(question_id) {
        return this.http.delete(`${this.API_URL}/${question_id}`, this.tokenService.getAuthorizedHeaderOptions())
                        .map(res => res.json());
    }

    updateQuestionVoteCount(id, author, num) {
        const body = {
            id: id,
            vote: num,
            author
        };
        return this.http.put(this.API_URL + '-update-vote', body).map(res => res ? res.json() : {});
    }

    updateQuestionReplyVotes(id, reply_id, isHelpful) {
        let num = 0;
        isHelpful ? num = 1 : num = -1;
        const body = {
            questionid: id,
            replyid: reply_id,
            vote: num
        };
        return this.http.put(`${this.API_URL}-update-comment-votes`, body, this.tokenService.getAuthorizedHeaderOptions())
                        .map(res => res.json());
    }
}
