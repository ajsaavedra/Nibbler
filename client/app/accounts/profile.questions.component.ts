import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../services/questions.service';
import { Helper } from '../services/helper.service';

@Component({
    templateUrl: './app/accounts/profile.questions.component.html',
    providers: [ Helper ]
})

export class ProfileQuestionsComponent implements OnInit, OnDestroy {
    private username;
    private subscriptions = [];
    private questions;

    constructor(private questionsService: QuestionService,
                private helper: Helper,
                private route: ActivatedRoute) {}

    ngOnInit() {
        const sub = this.route.params
            .map(params => params['username'])
            .switchMap(uname => {
                this.username = uname;
                return this.questionsService.getQuestionsByAuthor(this.username);
            })
            .subscribe(res => this.questions = res);
        this.subscriptions.push(sub);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    getTimeSince(datetime) {
        return this.helper.getTimeSince(datetime);
    }
}
