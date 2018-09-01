import { Component } from '@angular/core';
import { GlobalEventsManager } from '../GlobalEventsManager';
import { TokenService } from '../services/token.service';

@Component({
    templateUrl: './app/questions/questions-card.component.html'
})

export class QuestionsCardComponent {
    private questionsIcon = require('../../assets/images/questions.svg');

    constructor(
        private globalEventsManager: GlobalEventsManager,
        private tokenService: TokenService
    ) {}

    isLoggedIn() {
        return this.tokenService.tokenExists();
    }

    onPageReset(pageNumber: number) {
        this.globalEventsManager.setPageNumber(pageNumber);
    }

    onLimitReset(limit: number) {
        this.globalEventsManager.setLimitNumber(limit);
    }
}
