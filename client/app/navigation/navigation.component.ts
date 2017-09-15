import { Component } from '@angular/core';
import { GlobalEventsManager } from '../GlobalEventsManager';

@Component({
    selector: 'navigator',
    templateUrl: './app/navigation/navigation.component.html'
})

export class NavigationComponent {
    private isLoggedIn: boolean = false;
    private username: string = null;
    
    constructor(private globalEventsManager: GlobalEventsManager) {
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
}
