import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountsService } from '../services/accounts.service';
import { PasswordValidation } from './password.validation';

@Component({
    templateUrl: './app/accounts/signup.component.html',
    providers: [ AccountsService ]
})

export class SignupComponent {

    signupForm: FormGroup;
    fnameRegex = new RegExp(/[A-Z][a-z]+/);
    lnameRegex = new RegExp(/^([A-Z]'?[a-z]+)(-?[A-Z]'?[a-z]+)?$/);
    emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/);

    constructor(private router: Router,
                private fb: FormBuilder,
                private accountsService: AccountsService) {
        this.signupForm = fb.group({
            'fname': [null, Validators.compose([
                Validators.required,
                Validators.pattern(this.fnameRegex)])],
            'lname': [null, Validators.compose([
                Validators.required,
                Validators.pattern(this.fnameRegex)])],
            'email': [null, Validators.compose([
                Validators.required,
                Validators.pattern(this.emailRegex)])],
            'uname': [null, Validators.required],
            'password': [null, Validators.compose([
                Validators.required,
                Validators.pattern(this.passwordRegex)])],
            'confirmation': [null, Validators.required]
        }, { validator: PasswordValidation.passwordsMatch });
    }

    registerUser() {
        var fname = this.signupForm.get('fname').value;
        var lname = this.signupForm.get('lname').value;
        var uname = this.signupForm.get('uname').value;
        var email = this.signupForm.get('email').value;
        var pw = this.signupForm.get('password').value;

        this.accountsService
            .registerUser(fname, lname, uname, email, pw)
            .subscribe(
                res => this.router.navigateByUrl('/login'),
                err => {
                    if (err.status === 401) {
                        const body = JSON.parse(err._body);
                        alert(body['message']);
                    } else {
                        alert("Something went wrong with our server. Please try again.");
                    }
                }
            );
    }
}