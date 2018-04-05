import { Component, OnDestroy} from '@angular/core';
import { GlobalEventsManager } from './GlobalEventsManager';
import { AccountsService } from './services/accounts.service';

@Component({
    selector: 'my-app',
    template: `
        <navigator></navigator>
        <router-outlet></router-outlet>
        <footer class="container">
            <div class="text-center">
                <img src="{{ butterfly }}" title="&copy; {{ date }}">
            </div>
        </footer>
    `,
    providers: [ AccountsService ]
})

export class AppComponent implements OnDestroy {
    private butterfly: any = require('../assets/images/butterfly-center.svg');
    private date: number = new Date().getFullYear();
    private sub;

    constructor(private globalEventsManager: GlobalEventsManager,
                private accountsService: AccountsService) {
        this.sub = this.accountsService.isAuth().subscribe(res => {
            if (res.username) {
                this.globalEventsManager.showUserNavBar(true);
                this.globalEventsManager.setUserProfileTab(res.username);
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
