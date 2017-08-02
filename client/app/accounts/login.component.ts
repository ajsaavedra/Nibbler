import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    templateUrl: './app/accounts/login.component.html'
})

export class LoginComponent{

    loginForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.loginForm = fb.group({
            'email': [null, Validators.required],
            'password': [null, Validators.required]
        })
    }
}