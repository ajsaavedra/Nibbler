import { Component } from '@angular/core';

@Component({
    selector: 'questions-card',
    templateUrl: './app/questions/questions-card.component.html'
})

export class QuestionsCardComponent {
    private questionsIcon = require('../../assets/images/questions.svg');

    isLoggedIn() {
        return localStorage.getItem('username') && true;
    }
}
