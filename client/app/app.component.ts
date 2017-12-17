import { Component } from '@angular/core';
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

export class AppComponent {

    constructor(private globalEventsManager: GlobalEventsManager,
                private accountsService: AccountsService) {
        const uname: string = localStorage.getItem('username');
        if (uname) {
            this.globalEventsManager.showUserNavBar(true);
            this.globalEventsManager.setUserProfileTab(uname);
        }
    }
    
    private butterfly: any = require('../assets/images/butterfly-center.svg');
    private date: number = new Date().getFullYear();
}
