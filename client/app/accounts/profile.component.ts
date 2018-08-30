import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { decode } from 'jwt-simple';
import { AccountsService } from '../services/accounts.service';
import { GlobalEventsManager } from '../GlobalEventsManager';
import { secretKey } from '../../../config/secret';

@Component({
    templateUrl: './app/accounts/profile.component.html',
    providers: [ AccountsService ]
})

export class ProfileComponent implements OnInit {
    private token;
    private user: any;

    constructor(private router: Router) {}

    ngOnInit() {
        this.token = localStorage.getItem('token');
        if (this.token) {
            const decoded = decode(this.token, secretKey);
            this.user = decoded.user;
        } else {
            this.router.navigateByUrl('/login');
        }
    }
}
