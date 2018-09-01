import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/token.service';

@Component({
    templateUrl: './app/accounts/profile.votes-card.component.html'
})

export class ProfileVotesCardComponent implements OnInit {
    private username;

    constructor(private tokenService: TokenService) {}

    ngOnInit() {
        this.username = this.tokenService.getUsername();
    }
}
