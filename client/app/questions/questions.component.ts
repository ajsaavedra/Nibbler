import { Component, OnInit, OnDestroy } from '@angular/core';
import { QuestionService } from '../services/questions.service';
import { AccountsService } from '../services/accounts.service';
import { CacheService } from '../services/cache.service';

@Component({
    templateUrl: './app/questions/questions.component.html',
    providers: [ QuestionService, AccountsService ]
})

export class QuestionsComponent implements OnInit, OnDestroy {
    private questionsIcon = require('../../assets/images/questions.svg');
    private questionSearchItem: any;
    private questions = [];
    private subscriptions = [];
    private likedQuestions: any;
    private unlikedQuestions: any;
    private votesMap = new Map<string, number>();

    constructor(private questionService: QuestionService,
                private accountsService: AccountsService,
                private cacheService: CacheService) {
                    if (!this.cacheService._data['questions']) {
                        this.cacheService.getQuestions();
                    }
    }

    ngOnInit() {
        this.getCacheSubscription();
        this.getLikedAndUnlikedPosts();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    getCacheSubscription() {
        const questionSub = this.cacheService._data['questions'].subscribe(results => {
            this.questions = results;
            this.questions.forEach(q => this.votesMap.set(q._id, q.votes));
        });
        this.subscriptions.push(questionSub);
    }

    updateCachedVotes(id, point) {
        const sub1 = this.cacheService._data['questions'].subscribe(results => {
            results.filter(res => res._id === id).forEach(q => q['votes'] += point);
        });
        if (this.cacheService._data['question'] && this.cacheService._data['question'][id]) {
            const sub2 = this.cacheService._data['question'][id].subscribe(result => {
                result['votes'] += point;
            });
            this.subscriptions.push(sub2);
        }
        this.subscriptions.push(sub1);
    }

    getTimeSince(datetime) {
        const seconds = Math.floor((new Date().getTime() / 1000) - (Date.parse(datetime) / 1000));
        let interval = Math.floor(seconds / 31536000);

        if (interval >= 1) {
            return interval > 1 ? interval + ' years' : interval + ' year';
        }
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            return interval > 1 ? interval + ' months' : interval + ' month';
        }
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
            return interval > 1 ? interval + ' days' : interval + ' day';
        }
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
            return interval > 1 ? interval + ' hours' : interval + ' hour';
        }
        interval = Math.floor(seconds / 60);
        if (interval >= 1) {
            return interval > 1 ? interval + ' minutes' : interval + ' minute';
        }
        return Math.floor(seconds) + ' seconds';
    }

    like(id) {
        const uname = localStorage.getItem('username');
        if (uname) {
            this.updateVotesMapOnUpvote(id);
            if (this.likedQuestions[id]) {
                this.updateCachedVotes(id, -1);
            } else if (this.unlikedQuestions[id]) {
                this.updateCachedVotes(id, 2);
            } else {
                this.updateCachedVotes(id, 1);
            }
            const sub = this.accountsService.saveLikedPostToUser(uname, id).subscribe(res => {
                if (this.likedQuestions[id]) {
                    delete this.likedQuestions[id];
                    return;
                }
                this.likedQuestions[id] = true;
                if (this.unlikedQuestions[id]) {
                    delete this.unlikedQuestions[id];
                }
            }, err => false);

            this.subscriptions.push(sub);
        } else {
            alert('You must be a member to vote. Sign up today!');
        }
    }

    unlike(id) {
        const uname = localStorage.getItem('username');
        if (uname) {
            this.updateVotesMapOnDownvote(id);
            if (this.likedQuestions[id]) {
                this.updateCachedVotes(id, -2);
            } else if (this.unlikedQuestions[id]) {
                this.updateCachedVotes(id, 1);
            } else {
                this.updateCachedVotes(id, -1);
            }
            const sub = this.accountsService.removeLikedPostFromUser(uname, id).subscribe(res => {
                if (this.unlikedQuestions[id]) {
                    delete this.unlikedQuestions[id];
                    return;
                }
                this.unlikedQuestions[id] = true;
                if (this.likedQuestions[id]) {
                    delete this.likedQuestions[id];
                }
            }, err => false);

            this.subscriptions.push(sub);
        } else {
            alert('You must be a member to vote. Sign up today!');
        }
    }

    updateVotesMapOnDownvote(id) {
        const disliked = this.isUnliked(id);
        const liked = this.isLiked(id);
        let sub;
        if (disliked) {
            sub = this.questionService.updateQuestionVoteCount(id, 1)
                .subscribe(res => this.votesMap.set(id, this.votesMap.get(id) + 1));
        } else if (liked) {
            sub = this.questionService.updateQuestionVoteCount(id, -2)
                .subscribe(res => this.votesMap.set(id, this.votesMap.get(id) - 2));
        } else {
            sub = this.questionService.updateQuestionVoteCount(id, -1)
                .subscribe(res => this.votesMap.set(id, this.votesMap.get(id) - 1));
        }

        this.subscriptions.push(sub);
    }

    updateVotesMapOnUpvote(id) {
        const disliked = this.isUnliked(id);
        const liked = this.isLiked(id);
        let sub;
        if (liked) {
            sub = this.questionService.updateQuestionVoteCount(id, -1)
                .subscribe(res => this.votesMap.set(id, this.votesMap.get(id) - 1));
        } else if (disliked) {
            sub = this.questionService.updateQuestionVoteCount(id, 2)
                .subscribe(res => this.votesMap.set(id, this.votesMap.get(id) + 2));
        } else {
            sub = this.questionService.updateQuestionVoteCount(id, 1)
                .subscribe(res => this.votesMap.set(id, this.votesMap.get(id) + 1));
        }

        this.subscriptions.push(sub);
    }

    isLiked(id) {
        return this.likedQuestions && this.likedQuestions[id] && true;
    }

    isUnliked(id) {
        return this.unlikedQuestions && this.unlikedQuestions[id] && true;
    }

    getLikedAndUnlikedPosts() {
        const uname = localStorage.getItem('username');
        if (uname && true) {
            const sub1 = this.accountsService.getLikedPosts(uname).subscribe(res => {
                this.likedQuestions = res.posts ? res.posts : [];
            });
            const sub2 = this.accountsService.getUnlikedPosts(uname).subscribe(res => {
                this.unlikedQuestions = res.posts ? res.posts : [];
            });

            this.subscriptions.push(sub1, sub2);
        }
    }

    keystrokeListener() {
    }
}
