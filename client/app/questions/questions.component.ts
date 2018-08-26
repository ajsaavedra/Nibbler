import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../services/questions.service';
import { AccountsService } from '../services/accounts.service';
import { CacheService } from '../services/cache.service';
import { Helper } from '../services/helper.service';
import { GlobalEventsManager } from '../GlobalEventsManager';

@Component({
    templateUrl: './app/questions/questions.component.html',
    selector: 'all-questions',
    providers: [ Helper ]
})

export class QuestionsComponent implements OnInit, OnDestroy {
    private questionSearchItem: any;
    private questions = [];
    private subscriptions = [];
    private likedQuestions: any;
    private unlikedQuestions: any;
    private votesMap = new Map<string, number>();
    private field: string;
    private uname;

    constructor(private route: ActivatedRoute,
                private questionService: QuestionService,
                private accountsService: AccountsService,
                private cacheService: CacheService,
                private globalEventsManager: GlobalEventsManager,
                private helper: Helper) {}

    ngOnInit() {
        const sub = this.route.params.map(params => params['field'])
            .switchMap(field => {
                this.field = field ? field : 'questions';
                return this.globalEventsManager.pageResetEmitter;
            }).subscribe(pg => {
                this.uname = this.globalEventsManager.getUserProfiletab();
                const limit = this.globalEventsManager.getLimitNumber();
                this.cacheService.setCacheForQuestionType(this.field, limit, pg * limit);
                this.getCacheSubscription();
                this.getLikedAndUnlikedPosts();
            });
        this.subscriptions.push(sub);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.globalEventsManager.setLimitNumber(10);
        this.globalEventsManager.setPageNumber(0);
    }

    getCacheSubscription() {
        const questionSub = this.cacheService._data[this.field].subscribe(results => {
            if (results.length === 0) { return this.globalEventsManager.setPageNumber(0); }
            this.questions = results;
            this.questions.forEach(q => this.votesMap.set(q._id, q.votes));
        });
        this.subscriptions.push(questionSub);
    }

    updateCachedVotes(id, point) {
        ['questions', 'popularity', 'resolved'].forEach(tab => {
            if (this.cacheService._data[tab]) {
                const sub1 = this.cacheService._data[tab].subscribe(results => {
                    results.filter(res => res._id === id).forEach(item => item['votes'] += point);
                });
                this.subscriptions.push(sub1);
            }
        });
        if (this.cacheService._data['question'] && this.cacheService._data['question'][id]) {
            const sub2 = this.cacheService._data['question'][id].subscribe(result => {
                result['votes'] += point;
            });
            this.subscriptions.push(sub2);
        }
    }

    getTimeSince(datetime) {
        return this.helper.getTimeSince(datetime);
    }

    like(question) {
        const id = question._id;
        const author = question.author;
        let vote = 1;
        if (this.uname) {
            this.updateVotesMapOnUpvote(id, author);
            if (this.likedQuestions[id]) { vote = -1; } else if (this.unlikedQuestions[id]) { vote = 2; }
            this.updateCachedVotes(id, vote);
            const sub = this.accountsService
                .saveLikedPostToUser(this.uname, id)
                .do(res => {
                    if (this.likedQuestions[id]) {
                        delete this.likedQuestions[id];
                        return;
                    }
                    this.likedQuestions[id] = true;
                    if (this.unlikedQuestions[id]) { delete this.unlikedQuestions[id]; }
                }, err => false)
                .flatMap(res => this.cacheService._data['liked'])
                .subscribe(res => {
                    if (this.likedQuestions[id]) { res['posts'][id] = question; }
                });
            this.subscriptions.push(sub);
        } else {
            alert('You must be a member to vote. Sign up today!');
        }
    }

    unlike(question) {
        const id = question._id;
        const author = question.author;
        let vote = -1;
        if (this.uname) {
            this.updateVotesMapOnDownvote(id, author);
            if (this.likedQuestions[id]) { vote = -2; } else if (this.unlikedQuestions[id]) { vote = 1; }
            this.updateCachedVotes(id, vote);
            const sub = this.accountsService
                .removeLikedPostFromUser(this.uname, id)
                .do(res => {
                    if (this.unlikedQuestions[id]) {
                        delete this.unlikedQuestions[id];
                        return;
                    }
                    this.unlikedQuestions[id] = true;
                    if (this.likedQuestions[id]) { delete this.likedQuestions[id]; }
                }, err => false)
                .flatMap(res => this.cacheService._data['unliked'])
                .subscribe(res => {
                    if (this.unlikedQuestions[id]) { res['posts'][id] = question; }
                });
            this.subscriptions.push(sub);
        } else {
            alert('You must be a member to vote. Sign up today!');
        }
    }

    updateVotesMapOnDownvote(id, author) {
        const disliked = this.isUnliked(id);
        const liked = this.isLiked(id);
        let vote = -1;
        if (disliked) { vote = 1; } else if (liked) { vote = -2; }
        const sub = this.questionService.updateQuestionVoteCount(id, author, vote)
                .subscribe(res => this.votesMap.set(id, this.votesMap.get(id) + vote));
        this.subscriptions.push(sub);
    }

    updateVotesMapOnUpvote(id, author) {
        const disliked = this.isUnliked(id);
        const liked = this.isLiked(id);
        let vote = 1;
        if (liked) { vote = -1; } else if (disliked) { vote = 2; }
        const sub = this.questionService.updateQuestionVoteCount(id, author, vote)
                .subscribe(res => this.votesMap.set(id, this.votesMap.get(id) + vote));
        this.subscriptions.push(sub);
    }

    isLiked(id) {
        return this.likedQuestions && this.likedQuestions[id] && true;
    }

    isUnliked(id) {
        return this.unlikedQuestions && this.unlikedQuestions[id] && true;
    }

    getLikedAndUnlikedPosts() {
        if (this.uname) {
            if (!this.cacheService._data['liked'] ||
                !this.cacheService._data['unliked']) {
                this.cacheService.getLikedPosts();
                this.cacheService.getUnlikedPosts();
            }

            const sub1 = this.cacheService._data['liked'].subscribe(res => {
                this.likedQuestions = res.posts ? res.posts : [];
            });
            const sub2 = this.cacheService._data['unliked'].subscribe(res => {
                this.unlikedQuestions = res.posts ? res.posts : [];
            });

            this.subscriptions.push(sub1, sub2);
        }
    }
}
