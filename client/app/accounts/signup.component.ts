import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    templateUrl: './app/accounts/signup.component.html'
})

export class SignupComponent {

    signupForm: FormGroup;
    fnameRegex = new RegExp(/[A-Z][a-z]+/);
    lnameRegex = new RegExp(/^([A-Z]'?[a-z]+)(-?[A-Z]'?[a-z]+)?$/);
    emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/);

    constructor(private fb: FormBuilder) {
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
            'password': [null, Validators.compose([
                Validators.required,
                Validators.pattern(this.passwordRegex)])]
        })
    }
}