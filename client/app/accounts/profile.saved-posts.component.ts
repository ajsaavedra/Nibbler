import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AccountsService } from '../services/accounts.service';
import { TokenService } from '../services/token.service';
import { Helper } from '../services/helper.service';

@Component({
    templateUrl: './app/accounts/profile.saved-posts.component.html',
    providers: [ Helper ]
})

export class ProfileSavedPostsComponent implements OnInit, OnDestroy {
    private subscriptions = [];
    private savedData = {};

    constructor(
        private router: Router,
        private tokenService: TokenService,
        private accountsService: AccountsService,
        private helper: Helper
    ) {}

    ngOnInit() {
        if (!this.tokenService.tokenExists()) {
            this.router.navigateByUrl('/login');
            return;
        }
        const sub = this.accountsService.getUserSavedPosts().subscribe(res => this.savedData = res);
        this.subscriptions.push(sub);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    getTimeSince(datetime) {
        return this.helper.getTimeSince(datetime);
    }
}
