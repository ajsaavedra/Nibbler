import { Component } from '@angular/core';
import { GlobalEventsManager } from '../GlobalEventsManager';

@Component({
    selector: 'questions-card',
    templateUrl: './app/questions/questions-card.component.html'
})

export class QuestionsCardComponent {
    private questionsIcon = require('../../assets/images/questions.svg');

    constructor(private globalEventsManager: GlobalEventsManager) {}

    isLoggedIn() {
        return this.globalEventsManager.getUserProfiletab();
    }
}
