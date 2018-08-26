import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../services/questions.service';
import { AccountsService } from '../services/accounts.service';
import { CacheService } from '../services/cache.service';
import { GlobalEventsManager } from '../GlobalEventsManager';
@Component({
    templateUrl: './app/questions/question-details.component.html'
})

export class QuestionDetailsComponent implements OnInit, OnDestroy {
    private question: any;
    private subscriptions = [];
    private questionId: any;
    private isFavorited = false;
    private user: any;
    private liked = false;
    private disliked = false;
    private votes = 0;
    private uname;

    constructor(
        private route: ActivatedRoute,
        private questionService: QuestionService,
        private accountsService: AccountsService,
        private cacheService: CacheService,
        private globalEventsManager: GlobalEventsManager) {}

    ngOnInit() {
        this.uname = this.globalEventsManager.getUserProfiletab();
        const sub = this.route.params
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
            .subscribe(data => {
                this.question = data;
                this.votes = data['votes'];
            });

        this.subscriptions.push(sub);
        this.getIsFavorited(this.questionId);
        this.getLikedAndUnlikedPosts(this.questionId);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    updateCachedVotes(id, point) {
        if (this.cacheService._data['questions']) {
            const sub1 = this.cacheService._data['questions'].subscribe(results => {
                results.filter(res => res._id === id).forEach(q => q['votes'] += point);
            });
            this.subscriptions.push(sub1);
        }
        if (this.cacheService._data['question']) {
            const sub2 = this.cacheService._data['question'][id].subscribe(result => {
                result['votes'] += point;
            });
            this.subscriptions.push(sub2);
        }
    }

    getIsFavorited(id) {
        if (this.uname) {
            const accountSub =
                this.accountsService
                    .getUserSavedPosts()
                    .subscribe(res => {
                        this.isFavorited = res && res.filter(item => item._id === id).length > 0;
                    }, err => {
                        this.isFavorited = false;
                    });
            this.subscriptions.push(accountSub);
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

    like(question_id, question_author) {
        if (this.uname) {
            let vote = 1;
            if (this.liked) {
                vote = -1;
            } else if (this.disliked) {
                vote = 2;
            }
            this.updateCachedVotes(question_id, vote);
            const sub = this.questionService
                            .updateQuestionVoteCount(question_id, question_author, vote)
                            .subscribe(res => this.votes += vote);
            const sub2 = this.accountsService.saveLikedPostToUser(this.uname, question_id).subscribe(res => {
                this.liked = !this.liked;
                this.disliked = false;
            });
            this.subscriptions.push(sub, sub2);
        } else {
            alert('You must be a member to vote. Sign up today!');
        }
    }

    unlike(question_id, question_author) {
        if (this.uname) {
            let vote = -1;
            if (this.disliked) {
                vote = 1;
            } else if (this.liked) {
                vote = -2;
            }
            this.updateCachedVotes(question_id, vote);
            const sub = this.questionService
                            .updateQuestionVoteCount(question_id, question_author, vote)
                            .subscribe(res => this.votes += vote);
            const sub2 = this.accountsService.removeLikedPostFromUser(this.uname, question_id).subscribe(res => {
                this.disliked = !this.disliked;
                this.liked = false;
            });
            this.subscriptions.push(sub, sub2);
        } else {
            alert('You must be a member to vote. Sign up today!');
        }
    }

    getLikedAndUnlikedPosts(id) {
        if (this.uname && true) {
            const sub1 = this.accountsService.getLikedPosts().subscribe(res => {
                this.liked = res.posts && res.posts[id] && true;
            });
            const sub2 = this.accountsService.getUnlikedPosts().subscribe(res => {
                this.disliked = res.posts && res.posts[id] && true;
            });

            this.subscriptions.push(sub1, sub2);
        }
    }
}
