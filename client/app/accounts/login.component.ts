import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountsService } from '../services/accounts.service';
import { GlobalEventsManager } from '../GlobalEventsManager';

@Component({
    templateUrl: './app/accounts/login.component.html',
    providers: [ AccountsService ]
})

export class LoginComponent {

    loginForm: FormGroup;

    constructor(private fb: FormBuilder,
                private router: Router,
                private accountsService: AccountsService,
                private globalEventsManager: GlobalEventsManager) {
        this.loginForm = fb.group({
            'username': [null, Validators.required],
            'password': [null, Validators.required]
        })
    }

    loginUser() {
        var username = this.loginForm.get('username').value;
        var password  = this.loginForm.get('password').value;
        this.accountsService
            .loginUser(username, password)
            .subscribe(
                res => {
                    localStorage.setItem('username', username);
                    this.onLoginSuccessful(username);
                    this.router.navigateByUrl('/profile/' + username);
                },
                err => {
                    if (err.status === 403) {
                        alert('Invalid password. Please try again.');
                    } else if (err.status === 404) {
                        alert("User not found. Create an account today!");
                    } else {
                        alert("Oops. Something went wrong on our server. Please try again.");
                    }
                }
            );
    }

    onLoginSuccessful(uname: string) {
        this.globalEventsManager.showUserNavBar(true);
        this.globalEventsManager.setUserProfileTab(uname);
    }

    rerouteGuest() {
        this.router.navigateByUrl('/signup');
    }
}