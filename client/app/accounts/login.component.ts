import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    templateUrl: './app/accounts/login.component.html'
})

export class LoginComponent{

    loginForm: FormGroup;

    constructor(private fb: FormBuilder, private router: Router) {
        this.loginForm = fb.group({
            'email': [null, Validators.required],
            'password': [null, Validators.required]
        })
    }

    rerouteGuest() {
        this.router.navigateByUrl('/signup');
    }
}