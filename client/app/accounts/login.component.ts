import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountsService } from '../services/accounts.service';

@Component({
    templateUrl: './app/accounts/login.component.html',
    providers: [ AccountsService ]
})

export class LoginComponent{

    loginForm: FormGroup;

    constructor(private fb: FormBuilder,
                private router: Router,
                private accountsService: AccountsService) {
        this.loginForm = fb.group({
            'email': [null, Validators.required],
            'password': [null, Validators.required]
        })
    }

    loginUser() {
        var email = this.loginForm.get('email').value;
        var pw  = this.loginForm.get('password').value;
        this.accountsService
            .loginUser(email, pw)
            .subscribe(
                res => this.router.navigateByUrl('/'),
                err => {
                    if (err.status === 403) {
                        alert("Wrong password");
                    } else if (err.status === 404) {
                        alert("User not found. Create an account today.");
                    } else {
                        alert("Oops. Something went wrong on our server. Please try again.");
                    }
                }
            );
    }

    rerouteGuest() {
        this.router.navigateByUrl('/signup');
    }
}