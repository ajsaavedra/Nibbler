import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';

@Component({
    templateUrl: './app/accounts/profile.votes-card.component.html'
})

export class ProfileVotesCardComponent implements OnInit {
    private username;

    constructor(private router: Router, private tokenService: TokenService) {}

    ngOnInit() {
        if (!this.tokenService.tokenExists()) {
            this.router.navigateByUrl('/login');
            return;
        }
        this.username = this.tokenService.getUsername();
    }
}
