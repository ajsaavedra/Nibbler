import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../services/questions.service';
import { CacheService } from '../services/cache.service';
import { Helper } from '../services/helper.service';
import { TokenService } from '../services/token.service';

@Component({
    templateUrl: './app/accounts/profile.questions.component.html',
    providers: [ Helper ]
})

export class ProfileQuestionsComponent implements OnInit, OnDestroy {
    private username;
    private subscriptions = [];
    private questions;
    private uname;

    constructor(private questionsService: QuestionService,
                private cacheService: CacheService,
                private helper: Helper,
                private route: ActivatedRoute,
                private router: Router,
                private tokenService: TokenService) {}

    ngOnInit() {
        const sub = this.route.params
            .map(params => params['username'])
            .switchMap(uname => {
                this.username = uname;
                return this.questionsService.getQuestionsByAuthor(this.username);
            })
            .subscribe(res => this.questions = res, err => this.router.navigateByUrl('/'));
        this.subscriptions.push(sub);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    deleteQuestion(question_id) {
        const sub = this.questionsService.deleteQuestion(question_id)
            .switchMap(res => {
                if (!this.cacheService._data['questions']) {
                    this.cacheService.setCacheForQuestionType('questions', 10);
                }
                return this.cacheService._data['questions'];
            })
            .subscribe(res => {
                this.questions = this.questions.filter(q => q._id !== question_id);
            });
        this.subscriptions.push(sub);
    }

    belongsToUser() {
        return this.username === this.tokenService.getUsername();
    }

    getTimeSince(datetime) {
        return this.helper.getTimeSince(datetime);
    }
}
