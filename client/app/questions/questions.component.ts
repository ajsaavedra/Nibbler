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
    private sub: any;

    constructor(private questionService: QuestionService) {}

    ngOnInit() {
        this.sub = this.questionService.getAllQuestions().subscribe(results => this.questions = results);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    toggleVote() {
    }

    keystrokeListener() {
    }
}
