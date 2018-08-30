import { Component, OnDestroy } from '@angular/core';
import { decode } from 'jwt-simple';
import { GlobalEventsManager } from '../GlobalEventsManager';
import { Router } from '@angular/router';
import { secretKey } from '../../../config/secret';

@Component({
    selector: 'navigator',
    templateUrl: './app/navigation/navigation.component.html'
})

export class NavigationComponent implements OnDestroy {
    private token;
    private username: string = null;
    private subscriptions = [];

    constructor(private globalEventsManager: GlobalEventsManager,
                private router: Router) {
        this.subscriptions.push(
            this.globalEventsManager.showUserNavBarEmitter
            .subscribe(mode => {
                if (mode !== null) {
                    mode ? this.getTokenAndSetUsername() : this.resetUserVariables();
                }
            }));
        this.getTokenAndSetUsername();
    }

    logoutUser() {
        this.globalEventsManager.showUserNavBar(false);
        localStorage.removeItem('token');
        this.router.navigateByUrl('/login');
    }

    resetUserVariables() {
        this.username = null;
        this.token = null;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    getTokenAndSetUsername() {
        this.token = localStorage.getItem('token');
        if (this.token) {
            const decoded = decode(this.token, secretKey);
            this.username = decoded.user.profile.username;
        }
    }
}
