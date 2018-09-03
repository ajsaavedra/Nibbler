import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountsService } from '../services/accounts.service';
import { CacheService } from '../services/cache.service';
import { TokenService } from '../services/token.service';

@Component({
    templateUrl: './app/questions/question-details.component.html'
})

export class QuestionDetailsComponent implements OnInit, OnDestroy {
    private question: any;
    private subscriptions = [];
    private questionId: any;
    private isFavorited = false;
    private uname;

    constructor(
        private route: ActivatedRoute,
        private accountsService: AccountsService,
        private cacheService: CacheService,
        private tokenService: TokenService) {}

    ngOnInit() {
        if (this.tokenService.tokenExists()) { this.uname = this.tokenService.getUsername(); }
        this.subscriptions.push(this.route.params
            .map(params => params['id'])
            .switchMap(id => {
                if (id !== null && id !== undefined) {
                    this.questionId = id;
                    if (!this.cacheService._data['question'] ||
                        !this.cacheService._data['question'][id]) {
                            this.cacheService.getQuestionById(id);
                    }
                    return this.cacheService._data['question'][id];
                }
            })
            .subscribe(data => this.question = data)
        );
        this.getIsFavorited(this.questionId);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    getIsFavorited(id) {
        if (this.uname) {
            this.subscriptions.push(
                this.accountsService
                    .getUserSavedPosts()
                    .subscribe(res => {
                        this.isFavorited = res && res.length > 0 && res.filter(item => item._id === id).length > 0;
                    })
            );
        }
    }

    toggleFavorite() {
        if (this.uname && !this.isFavorited) {
            this.accountsService.savePostToUser(this.uname, this.questionId)
                .subscribe(res => this.isFavorited = true, err => this.isFavorited = false);
        } else if (this.uname && this.isFavorited) {
            this.accountsService.removePostFromUser(this.uname, this.questionId)
                .subscribe(res => this.isFavorited = false);
        } else {
            alert('You must be logged in to save a post.');
        }
    }
}
