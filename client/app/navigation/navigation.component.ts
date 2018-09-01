import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalEventsManager } from '../GlobalEventsManager';
import { TokenService } from '../services/token.service';

@Component({
    selector: 'nibbler-navigator',
    templateUrl: './app/navigation/navigation.component.html'
})

export class NavigationComponent implements OnDestroy {
    private username: string = null;
    private subscriptions = [];

    constructor(private globalEventsManager: GlobalEventsManager,
                private router: Router, private tokenService: TokenService) {
        this.subscriptions.push(
            this.globalEventsManager.showUserNavBarEmitter
            .subscribe(mode => {
                if (mode !== null) {
                    mode ? this.getUsername() : this.username = null;
                }
            }));
        this.getUsername();
    }

    logoutUser() {
        this.globalEventsManager.showUserNavBar(false);
        this.tokenService.deleteToken();
        this.router.navigateByUrl('/login');
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    getUsername() {
        if (this.tokenService.tokenExists()) {
            this.username = this.tokenService.decodeToken()['profile'].username;
        }
    }
}
