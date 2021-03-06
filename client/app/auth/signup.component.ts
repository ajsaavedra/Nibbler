import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountsService } from '../services/accounts.service';
import { GeocodingService } from '../services/geocoding.service';
import { PasswordValidation } from './password.validation';
import { TokenService } from '../services/token.service';
import { DialogService } from '../services/dialog.service';
import { ValidateDiet } from '../common/diet-option.validation';
import {
    trigger,
    state,
    style,
    animate,
    transition
  } from '@angular/animations';

@Component({
    templateUrl: './app/auth/signup.component.html',
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

export class SignupComponent implements OnInit, OnDestroy {

    private formState = 'inactive';
    private signupFormPageOne: FormGroup;
    private signupFormPageTwo: FormGroup;
    private signupFormDietSelection: FormGroup;
    private fnameRegex = new RegExp(/[A-Z][a-z]+/);
    private lnameRegex = new RegExp(/^([A-Z]'?[a-z]+)(-?[A-Z]'?[a-z]+)?$/);
    private emailRegex = new RegExp(['^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))',
                                    '@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])',
                                    '|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'].join(''));
    private passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/);
    private zipcodeRegex = new RegExp(/^\d{5}(?:[-\s]\d{4})?$/);

    constructor(
        private router: Router,
            private fb: FormBuilder,
            private accountsService: AccountsService,
            private geocodingService: GeocodingService,
            private tokenService: TokenService,
            private dialog: DialogService) {
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
            ])]
        }, { validator: PasswordValidation.passwordsMatch });

        this.signupFormDietSelection = fb.group({
            'gluten-free': [false, ValidateDiet],
            'vegan': [false, ValidateDiet],
            'vegetarian': [false, ValidateDiet],
            'soy-free': [false, ValidateDiet],
            'nut-free': [false, ValidateDiet]
        });
    }

    ngOnInit() {
        if (this.tokenService.tokenExists()) {
            this.router.navigateByUrl('/profile/' + this.tokenService.getUsername());
        }
    }

    ngOnDestroy() {
        this.dialog.toggleActive(false);
    }

    checkUserInfo() {
        const email = this.signupFormPageOne.get('email').value;
        const uname = this.signupFormPageOne.get('uname').value;

        this.accountsService
            .checkIfUserExists(email, uname)
            .subscribe(
                res => this.toggleState(),
                err => {
                    const body = JSON.parse(err._body);
                    this.dialog.setMessage(body['message']);
                    this.dialog.toggleActive(true);
                }
            );
    }

    toggleState() {
        this.formState = this.formState === 'active' ? 'inactive' : 'active';
    }

    collectUserData() {
        const fname = this.signupFormPageOne.get('fname').value;
        const lname = this.signupFormPageOne.get('lname').value;
        const uname = this.signupFormPageOne.get('uname').value;
        const email = this.signupFormPageOne.get('email').value;
        const pw = this.signupFormPageTwo.get('password').value;
        const zip = this.signupFormPageTwo.get('zipcode').value;
        const gf = this.signupFormDietSelection.get('gluten-free').value;
        const vg = this.signupFormDietSelection.get('vegan').value;
        const veg = this.signupFormDietSelection.get('vegetarian').value;
        const nf = this.signupFormDietSelection.get('nut-free').value;
        const sf = this.signupFormDietSelection.get('soy-free').value;

        this.searchLocation(zip)
            .then(fulfilled => {
                const result = fulfilled.results[0];
                const lat = result.position.lat;
                const lng = result.position.lon;
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
                    this.dialog.setMessage(body['message']);
                } else {
                    this.dialog.setMessage('Something went wrong with our server. Please try again.');
                }
                this.dialog.toggleActive(true);
            }
        );
    }

    searchLocation(zipcode) {
        return this.geocodingService.getGeoLocation(zipcode);
    }
}
