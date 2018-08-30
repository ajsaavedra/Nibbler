import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountsService } from '../services/accounts.service';
import { GlobalEventsManager } from '../GlobalEventsManager';

@Component({
    templateUrl: './app/auth/login.component.html',
    providers: [ AccountsService ]
})

export class LoginComponent implements OnInit, OnDestroy {

    private loginForm: FormGroup;
    private loginSubscription;

    constructor(private fb: FormBuilder,
                private router: Router,
                private accountsService: AccountsService,
                private globalEventsManager: GlobalEventsManager) {
        this.loginForm = fb.group({
            'username': [null, Validators.required],
            'password': [null, Validators.required]
        });
    }

    ngOnInit() {
        const name = this.globalEventsManager.getUserProfiletab();
        if (name) {
            this.router.navigateByUrl('/profile/' + name);
        }
    }

    ngOnDestroy() {
        if (this.loginSubscription) { this.loginSubscription.unsubscribe(); }
    }

    loginUser() {
        const username = this.loginForm.get('username').value;
        const password  = this.loginForm.get('password').value;
        this.loginSubscription = this.accountsService
            .loginUser(username, password)
            .subscribe(
                res => {
                    localStorage.setItem('token', res.token);
                    this.globalEventsManager.showUserNavBar(true);
                    this.router.navigateByUrl('/profile/' + username);
                },
                err => {
                    if (err.status === 401) {
                        alert('Invalid login information. Please try again.');
                    } else {
                        alert('Oops. Something went wrong on our server. Please try again.');
                    }
                }
            );
    }

    rerouteGuest() {
        this.router.navigateByUrl('/signup');
    }
}
