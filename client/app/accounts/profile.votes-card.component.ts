import { Component, OnInit } from '@angular/core';
import { GlobalEventsManager } from '../GlobalEventsManager';

@Component({
    templateUrl: './app/accounts/profile.votes-card.component.html'
})

export class ProfileVotesCardComponent implements OnInit {
    private username;

    constructor(private globalEventsManager: GlobalEventsManager) {}

    ngOnInit() {
        this.username = this.globalEventsManager.getUserProfiletab();
    }
}
