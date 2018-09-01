import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';

@Component({
    templateUrl: './app/home/home.component.html'
})

export class HomeComponent {
    private basket = require('../../assets/images/groceries.svg');

    constructor(private router: Router, private tokenService: TokenService) {
        if (this.tokenService.tokenExists()) {
            this.router.navigateByUrl('locations');
        }
    }
}
