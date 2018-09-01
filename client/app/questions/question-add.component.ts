import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DragulaService } from 'ng2-dragula';
import { QuestionService } from '../services/questions.service';
import { TokenService } from '../services/token.service';

@Component({
    templateUrl: './app/questions/question-add.component.html'
})

export class QuestionAddComponent implements OnInit, OnDestroy {
    private formIcon = require('../../assets/images/file.svg');
    private addQuestionForm: FormGroup;
    private tags;
    private userDefinedTags = [];
    private uname;
    private subscriptions = [];

    constructor(private fb: FormBuilder,
                private router: Router,
                private dragula: DragulaService,
                private questionService: QuestionService,
                private tokenService: TokenService) {
        this.addQuestionForm = fb.group({
            'title': [null, Validators.required],
            'question': [null, Validators.required]
        });
        this.setTags();

        this.subscriptions.push(
            dragula.dropModel.subscribe((value) => {
                this.onDropModel(value.slice(1));
            })
        );

        this.subscriptions.push(
            dragula.removeModel.subscribe((value) => {
                this.onRemoveModel(value.slice(1));
            })
        );
    }

    ngOnInit() {
        this.uname = this.tokenService.getUsername();
        if (!this.uname) {
            this.router.navigateByUrl('/login');
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    setTags() {
        this.tags = [
            'Gluten Free', 'Vegetarian', 'Vegan', 'Soy Free', 'Nut Free',
            'Celiac Disease', 'Health Remedies', 'Lifestyle', 'Child',
            'Recipes', 'Gluten', 'Allergy', 'Health', 'Travel', 'Personal',
            'Mental Health', 'Rant', 'Info', 'Symptoms'
        ];
    }

    onDropModel(args) {
        const [el, target, source] = args;
    }

    onRemoveModel(args) {
        const [el, source] = args;
    }

    submitQuestion() {
        const title = this.addQuestionForm.get('title').value;
        const text = this.addQuestionForm.get('question').value;
        this.subscriptions.push(
            this.questionService
                .postUserQuestion(this.uname, title, text, this.userDefinedTags)
                .subscribe(res => {
                    this.router.navigateByUrl('/profile/' + this.uname + '/questions');
            })
        );
    }
}
