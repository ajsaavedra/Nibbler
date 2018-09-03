import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CacheService } from '../services/cache.service';
import { Helper } from '../services/helper.service';
import { TokenService } from '../services/token.service';

@Component({
    templateUrl: './app/accounts/profile.saved-comments.component.html',
    providers: [ Helper ]
})

export class ProfileSavedCommentsComponent implements OnInit, OnDestroy {
    private subscription;
    private savedData = [];

    constructor(
        private router: Router,
        private cacheService: CacheService,
        private tokenService: TokenService,
        private helper: Helper
    ) {}

    ngOnInit() {
        if (this.tokenService.tokenExists()) {
            if (!this.cacheService._data['helpfulComments']) {
                this.cacheService.getHelpfulComments();
            }
            this.subscription = this.cacheService._data['helpfulComments'].subscribe(res => {
                console.log(res);
                if (res || res.length > 0) {
                    Object.keys(res).forEach(postTitle => {
                        res[postTitle]['title'] = postTitle;
                        this.savedData.push(res[postTitle]);
                    });
                }
            });
        } else {
            this.router.navigateByUrl('/login');
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    getTimeSince(datetime) {
        return this.helper.getTimeSince(datetime);
    }
}
