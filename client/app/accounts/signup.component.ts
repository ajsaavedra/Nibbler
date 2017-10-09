import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountsService } from '../services/accounts.service';
import { GeocodingService } from '../services/geocoding.service';
import { PasswordValidation } from './password.validation';
import {
    trigger,
    state,
    style,
    animate,
    transition
  } from '@angular/animations';

@Component({
    templateUrl: './app/accounts/signup.component.html',
    providers: [ AccountsService, GeocodingService ],
    animations: [
        trigger('firstState', [        
           state('inactive', style({
               'margin-left': 0
           })),
           state('active', style({
                'margin-left': '-1000px'
           })),
           transition('inactive <=> active', animate('.2s ease-out'))
        ])
    ]
})

export class SignupComponent {

    private formState: string = 'inactive';
    private signupFormPageOne: FormGroup;
    private signupFormPageTwo: FormGroup;
    private fnameRegex = new RegExp(/[A-Z][a-z]+/);
    private lnameRegex = new RegExp(/^([A-Z]'?[a-z]+)(-?[A-Z]'?[a-z]+)?$/);
    private emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    private passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/);
    private zipcodeRegex = new RegExp(/^\d{5}(?:[-\s]\d{4})?$/);

    constructor(private router: Router,
                private fb: FormBuilder,
                private accountsService: AccountsService,
                private geocodingService: GeocodingService) {
        this.signupFormPageOne = fb.group({
            'fname': [null, Validators.compose([
                Validators.required,
                Validators.pattern(this.fnameRegex)])],
            'lname': [null, Validators.compose([
                Validators.required,
                Validators.pattern(this.fnameRegex)])],
            'email': [null, Validators.compose([
                Validators.required,
                Validators.pattern(this.emailRegex)])],
            'uname': [null, Validators.required]
        });

        this.signupFormPageTwo = fb.group({
            'password': [null, Validators.compose([
                Validators.required,
                Validators.pattern(this.passwordRegex)])],
            'confirmation': [null, Validators.required],
            'zipcode': [null, Validators.compose([
                Validators.required,
                Validators.pattern(this.zipcodeRegex)
            ])],
            'gluten-free': false,
            'vegan': false,
            'vegetarian': false,
            'soy-free': false,
            'nut-free': false
        }, { validator: PasswordValidation.passwordsMatch });
    }

    checkUserInfo() {
        var email = this.signupFormPageOne.get('email').value;
        var uname = this.signupFormPageOne.get('uname').value;

        this.accountsService
            .checkIfUserExists(email, uname)
            .subscribe(
                res => this.toggleState(),
                err => {
                    const body = JSON.parse(err._body);
                    alert(body['message']);
                }
            );
    }

    toggleState() {
        this.formState = this.formState === 'active' ? 'inactive' : 'active';
    }

    collectUserData() {
        var fname = this.signupFormPageOne.get('fname').value;
        var lname = this.signupFormPageOne.get('lname').value;
        var uname = this.signupFormPageOne.get('uname').value;
        var email = this.signupFormPageOne.get('email').value;
        var pw = this.signupFormPageTwo.get('password').value;
        var zip = this.signupFormPageTwo.get('zipcode').value;
        var gf = this.signupFormPageTwo.get('gluten-free').value;
        var vg = this.signupFormPageTwo.get('vegan').value;
        var veg = this.signupFormPageTwo.get('vegetarian').value;
        var nf = this.signupFormPageTwo.get('nut-free').value;
        var sf = this.signupFormPageTwo.get('soy-free').value;
        
        this.searchLocation(zip)
            .then(fulfilled => {
                const result = fulfilled.results[0];
                const lat = result.geometry.location.lat;
                const lng = result.geometry.location.lng;
                this.registerUser(fname, lname, uname, email,
                    pw, lat, lng, gf, vg, veg, nf, sf);
            })
            .catch(err => {
                console.log(err.message);
            });
    }

    registerUser(fname, lname, uname, email, pw, lat, lng, gf, vg, veg, nf, sf) {
        this.accountsService
        .registerUser(fname, lname, uname, email, pw, lat, lng, gf, vg, veg, nf, sf)
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

    searchLocation(zipcode) {
        return this.geocodingService.updateUserLocation(zipcode);
    }
}