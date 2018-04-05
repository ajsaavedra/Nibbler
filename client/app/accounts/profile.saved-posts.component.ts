import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountsService } from '../services/accounts.service';
import { CacheService } from '../services/cache.service';
import { Helper } from '../services/helper.service';

@Component({
    templateUrl: './app/accounts/profile.saved-posts.component.html',
    providers: [ Helper ]
})

export class ProfileSavedPostsComponent implements OnInit, OnDestroy {
    private subscriptions = [];
    private savedData;

    constructor(private accountsService: AccountsService,
                private cacheService: CacheService,
                private helper: Helper) {}

    ngOnInit() {
        const sub = this.accountsService.getUserSavedPosts().subscribe(res => this.savedData = res);
        this.subscriptions.push(sub);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    getTimeSince(datetime) {
        return this.helper.getTimeSince(datetime);
    }
}
