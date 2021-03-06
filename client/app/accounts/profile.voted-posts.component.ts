import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { CacheService } from '../services/cache.service';
import { Helper } from '../services/helper.service';

@Component({
    templateUrl: './app/accounts/profile.voted-posts.component.html',
    providers: [ Helper ]
})

export class ProfileVotedPostsComponent implements OnInit, OnDestroy {
    private subscriptions = [];
    private savedData;
    private field: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private tokenService: TokenService,
        private cacheService: CacheService,
        private helper: Helper
    ) {}

    ngOnInit() {
        if (!this.tokenService.tokenExists()) {
            this.router.navigateByUrl('/login');
            return;
        }
        const sub = this.route.params.subscribe(params => {
            this.field = params['field'] ? params['field'] : 'upvoted';
            this.field === 'upvoted' ? this.getLikedPosts() : this.getDislikedPosts();
        });
        this.subscriptions.push(sub);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    getLikedPosts() {
        this.savedData = [];
        if (!this.cacheService._data['liked']) {
            this.cacheService.getLikedPosts();
        }
        const sub = this.cacheService._data['liked'].subscribe(res => {
            if (res.posts) {
                Object.keys(res.posts).forEach(post => {
                    this.savedData.push(res.posts[post]);
                });
            }
        });
        this.subscriptions.push(sub);
    }

    getDislikedPosts() {
        this.savedData = [];
        if (!this.cacheService._data['unliked']) {
            this.cacheService.getUnlikedPosts();
        }
        const sub = this.cacheService._data['unliked'].subscribe(res => {
            if (res.posts) {
                Object.keys(res.posts).forEach(post => {
                    this.savedData.push(res.posts[post]);
                });
            }
        });
        this.subscriptions.push(sub);
    }

    getTimeSince(datetime) {
        return this.helper.getTimeSince(datetime);
    }
}
