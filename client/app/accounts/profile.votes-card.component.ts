import { Component, OnInit } from '@angular/core';
@Component({
    templateUrl: './app/accounts/profile.votes-card.component.html'
})

export class ProfileVotesCardComponent implements OnInit {
    private username;

    ngOnInit() {
        this.username = localStorage.getItem('username');
    }
}
