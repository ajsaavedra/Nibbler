import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../services/questions.service';

@Component({
    templateUrl: './app/questions/question-details.component.html',
    providers: [ QuestionService ]
})

export class QuestionDetailsComponent implements OnInit, OnDestroy {
    private question: any;
    private sub: any;
    private isFavorited = false;

    constructor(private route: ActivatedRoute, private questionService: QuestionService) {}

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            const id = params['id'];
            this.questionService.getQuestionById(id).subscribe(question => this.question = question);
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    toggleFavorite() {
        this.isFavorited = !this.isFavorited;
    }
}
