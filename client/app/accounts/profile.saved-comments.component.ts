import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountsService } from '../services/accounts.service';
import { CacheService } from '../services/cache.service';
import { Helper } from '../services/helper.service';

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
                private helper: Helper) {}

    ngOnInit() {
        this.username = localStorage.getItem('username');
        if (this.username) {
            if (!this.cacheService._data['helpfulComments']) {
                this.cacheService.getHelpfulComments(this.username);
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
