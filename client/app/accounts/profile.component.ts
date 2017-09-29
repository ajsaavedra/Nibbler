import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountsService } from '../services/accounts.service';

@Component({
    templateUrl: './app/accounts/profile.component.html',
    providers: [ AccountsService ]
})

export class ProfileComponent implements OnInit, OnDestroy {
    private sub: any;
    private user: any;
    private isLocalUser: boolean;

    constructor(private accountsService: AccountsService,
                private route: ActivatedRoute,
                private router: Router) {}

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            let username = params['username'];
            this.isLocalUser = username === localStorage.getItem('username');
            this.accountsService
                .getUserProfile(username)
                .subscribe(
                    res => this.user = res,
                    err => {
                        this.router.navigateByUrl('/login');
                    }
                );
        })
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}