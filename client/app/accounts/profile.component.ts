import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService } from '../services/accounts.service';
import { TokenService } from '../services/token.service';

@Component({
    templateUrl: './app/accounts/profile.component.html',
})

export class ProfileComponent implements OnInit, OnDestroy {
    private token: string;
    private user: Object;
    private isLocalUser: boolean;
    private subscriptions = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private accountsService: AccountsService,
        private tokenService: TokenService) {
            if (this.tokenService.tokenExists()) {
                this.token = this.tokenService.getToken();
            }
    }

    ngOnInit() {
        this.subscriptions.push(this.route.params.subscribe(params => {
            const username = params['username'];
            let user;
            if (this.token) {
                user = this.tokenService.decodeToken();
                this.isLocalUser = username === user['profile'].username;
            }
            if (this.isLocalUser) {
                this.user = user;
            } else { this.getUserProfile(username); }
        }));
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    getUserProfile(username) {
        this.subscriptions.push(this.accountsService.getUserProfile(username)
            .subscribe(res => this.user = res, err => this.router.navigateByUrl('/'))
        );
    }
}
