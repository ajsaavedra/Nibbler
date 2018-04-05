import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountsService } from '../services/accounts.service';
import { CacheService } from '../services/cache.service';
import { Helper } from '../services/helper.service';
import { GlobalEventsManager } from '../GlobalEventsManager';

@Component({
    templateUrl: './app/accounts/profile.saved-comments.component.html',
    providers: [ Helper ]
})

export class ProfileSavedCommentsComponent implements OnInit, OnDestroy {
    private subscriptions = [];
    private username;
    private savedData = [];

    constructor(private accountsService: AccountsService,
                private cacheService: CacheService,
                private globalEventsManager: GlobalEventsManager,
                private helper: Helper) {}

    ngOnInit() {
        if (this.globalEventsManager.getUserProfiletab()) {
            if (!this.cacheService._data['helpfulComments']) {
                this.cacheService.getHelpfulComments();
            }
            const sub = this.cacheService._data['helpfulComments'].subscribe(res => {
                Object.keys(res).forEach(postTitle => {
                    res[postTitle]['title'] = postTitle;
                    this.savedData.push(res[postTitle]);
                });
            });
            this.subscriptions.push(sub);
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    getTimeSince(datetime) {
        return this.helper.getTimeSince(datetime);
    }
}
