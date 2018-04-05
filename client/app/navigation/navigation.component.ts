import { Component, OnDestroy } from '@angular/core';
import { GlobalEventsManager } from '../GlobalEventsManager';
import { AccountsService } from '../services/accounts.service';
import { Router } from '@angular/router';

@Component({
    selector: 'navigator',
    templateUrl: './app/navigation/navigation.component.html',
    providers: [ AccountsService ]
})

export class NavigationComponent implements OnDestroy {
    private isLoggedIn = false;
    private username: string = null;
    private sub;

    constructor(private globalEventsManager: GlobalEventsManager,
                private accountsService: AccountsService,
                private router: Router) {
        this.globalEventsManager.showUserNavBarEmitter.subscribe((mode) => {
            if (mode !== null) {
                this.isLoggedIn = mode;
            }
        });
        this.globalEventsManager.showUserProfileTabEmitter.subscribe((username) => {
            if (username !== null) {
                this.username = username;
            }
        });
    }

    logoutUser() {
        this.sub = this.accountsService.logoutUser(this.username).subscribe(res => {
                this.globalEventsManager.showUserNavBar(false);
                this.globalEventsManager.setUserProfileTab('');
                this.router.navigateByUrl('/login');
            }
        );
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
