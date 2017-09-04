import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountsService } from '../services/accounts.service';

@Component({
    templateUrl: './app/accounts/profile.component.html',
    providers: [ AccountsService ]
})

export class ProfileComponent implements OnInit {
    sub: any;
    user: any;

    constructor(private accountsService: AccountsService,
                private route: ActivatedRoute,
                private router: Router) {}

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            let username = params['username'];
            this.accountsService
                .getLoginStatus(username)
                .subscribe(
                    res => this.user = res,
                    err => {
                        this.router.navigateByUrl('/login');
                    }
                );
        })
    }
}