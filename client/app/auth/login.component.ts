import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountsService } from '../services/accounts.service';
import { GlobalEventsManager } from '../GlobalEventsManager';
import { TokenService } from '../services/token.service';
import { DialogService } from '../services/dialog.service';

@Component({
    templateUrl: './app/auth/login.component.html',
    providers: [ AccountsService ]
})

export class LoginComponent implements OnInit, OnDestroy {

    private loginForm: FormGroup;
    private loginSubscription;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private accountsService: AccountsService,
        private globalEventsManager: GlobalEventsManager,
        private tokenService: TokenService,
        private dialog: DialogService
    ) {
        this.loginForm = fb.group({
            'username': [null, Validators.required],
            'password': [null, Validators.required]
        });
    }

    ngOnInit() {
        if (this.tokenService.tokenExists()) {
            const name = this.tokenService.getUsername();
            this.router.navigateByUrl('/profile/' + name);
        }
    }

    ngOnDestroy() {
        if (this.loginSubscription) { this.loginSubscription.unsubscribe(); }
        this.dialog.toggleActive(false);
    }

    loginUser() {
        const username = this.loginForm.get('username').value;
        const password  = this.loginForm.get('password').value;
        this.loginSubscription = this.accountsService
            .loginUser(username, password)
            .subscribe(
                res => {
                    this.tokenService.setToken(res.token);
                    this.globalEventsManager.showUserNavBar(true);
                    this.router.navigateByUrl('/profile/' + username);
                },
                err => {
                    if (err.status === 401) {
                        this.dialog.setMessage('Invalid login information. Please try again');
                    } else {
                        this.dialog.setMessage('Oops. Something went wrong on our server. Please try again.');
                    }
                    this.dialog.toggleActive(true);
                }
            );
    }

    rerouteGuest() {
        this.router.navigateByUrl('/signup');
    }
}
