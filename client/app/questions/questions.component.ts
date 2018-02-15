import { Component, OnInit, OnDestroy } from '@angular/core';
import { QuestionService } from '../services/questions.service';

@Component({
    templateUrl: './app/questions/questions.component.html',
    providers: [ QuestionService ]
})

export class QuestionsComponent implements OnInit, OnDestroy {
    private questionsIcon = require('../../assets/images/questions.svg');
    private questionSearchItem: any;
    private questions = [];
    private questionSub: any;

    constructor(private questionService: QuestionService) {}

    ngOnInit() {
        this.questionSub = this.questionService.getAllQuestions().subscribe(results => {
            this.questions = results;
        });
    }

    ngOnDestroy() {
        this.questionSub.unsubscribe();
    }

    getTimeSince(datetime) {
        const seconds = Math.floor((new Date().getTime() / 1000) - (Date.parse(datetime) / 1000));
        let interval = Math.floor(seconds / 31536000);

        if (interval >= 1) {
            return interval > 1 ? interval + ' years' : interval + ' year';
        }
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            return interval > 1 ? interval + ' months' : interval + ' month';
        }
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
            return interval > 1 ? interval + ' days' : interval + ' day';
        }
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
            return interval > 1 ? interval + ' hours' : interval + ' hour';
        }
        interval = Math.floor(seconds / 60);
        if (interval >= 1) {
            return interval > 1 ? interval + ' minutes' : interval + ' minute';
        }
        return Math.floor(seconds) + ' seconds';
    }

    toggleVote() {
    }

    keystrokeListener() {
    }
}
