import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { TokenService } from '../services/token.service';
import { CacheService } from '../services/cache.service';
import { QuestionService } from '../services/questions.service';
import { AccountsService } from '../services/accounts.service';
import { Helper } from '../services/helper.service';

@Component({
    selector: 'nibbler-voting-component',
    templateUrl: './app/common/voting.component.html',
    providers: [ Helper ]
})

export class VotingComponent implements OnInit, OnDestroy {
    @Input() question;
    @Input() votesMap;
    @Input() isDetailsPage;
    @Input() liked;
    @Input() disliked;

    private likedQuestions;
    private dislikedQuestions;
    private subscriptions = [];

    constructor(
        private tokenService: TokenService,
        private cacheService: CacheService,
        private questionService: QuestionService,
        private accountsService: AccountsService,
        private helper: Helper
    ) {}

    ngOnInit() {
        if (this.tokenService.tokenExists()) {
            this.getLikedAndUnlikedPosts();
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    isLiked(id) {
        return this.likedQuestions && this.likedQuestions[id] && true;
    }

    isDisliked(id) {
        return this.dislikedQuestions && this.dislikedQuestions[id] && true;
    }

    getTimeSince(datetime) {
        return this.helper.getTimeSince(datetime);
    }

    private updateCachedVotesForListOfQuestions(id, point) {
        ['question', 'questions', 'popularity', 'resolved'].forEach(tab => {
            let cachedSubscription = this.cacheService._data[tab];
            if (cachedSubscription) {
                if (tab === 'question') { cachedSubscription = this.cacheService._data[tab][id]; }
                this.subscriptions.push(cachedSubscription.subscribe(results => {
                    if (tab === 'question') {
                        results['votes'] += point;
                    } else {
                        results.filter(res => res._id === id).forEach(item => item['votes'] += point);
                    }
                }));
            }
        });
    }

    vote(question, isUpvote: boolean) {
        const { _id, author } = question;
        if (this.tokenService.tokenExists()) {
           this.getNumberToVoteBy(_id, isUpvote).then(vote => {
                this.updateCachedVotesForListOfQuestions(_id, vote);
                this.updateVotesMap(_id, author, vote);
                return isUpvote ? this.accountsService.saveLikedPostToUser(this.tokenService.getUsername(), _id).toPromise() :
                                    this.accountsService.removeLikedPostFromUser(author, _id).toPromise();
           })
           .then(() => this.updateListOfVotedQuestionsOnVote(_id, isUpvote))
           .then(() => isUpvote ? this.cacheService._data['liked'] : this.cacheService._data['unliked'])
           .then(res => {
               this.subscriptions.push(res.subscribe(data => {
                    if ((isUpvote && this.likedQuestions[_id]) || (!isUpvote && this.dislikedQuestions[_id])) {
                        data['posts'][_id] = question;
                    }
                }));
           })
           .catch((err) => {
               alert('Could not save your vote. Try later.');
           });
        } else {
            alert('You must be a member to vote. Sign up today!');
        }
    }

    getNumberToVoteBy(id: string, isUpvote: boolean) {
        return new Promise(resolve => {
            if (isUpvote) {
                if (this.isLiked(id)) { resolve(-1); }
                if (this.isDisliked(id)) { resolve(2); } else { resolve(1); }
            } else {
                if (this.isLiked(id)) { resolve(-2); }
                if (this.isDisliked(id)) { resolve(1); } else { resolve(-1); }
            }
        });
    }

    updateListOfVotedQuestionsOnVote(id: string, isUpvote: boolean) {
        if (isUpvote) {
            if (this.likedQuestions[id]) {
                delete this.likedQuestions[id];
                return;
            }
            this.likedQuestions[id] = true;
            if (this.dislikedQuestions[id]) { delete this.dislikedQuestions[id]; }
        } else {
            if (this.dislikedQuestions[id]) {
                delete this.dislikedQuestions[id];
                return;
            }
            this.dislikedQuestions[id] = true;
            if (this.likedQuestions[id]) { delete this.likedQuestions[id]; }
        }
    }

    updateCachedInfo(isUpvote: boolean) {
        return new Promise(resolve => {
            isUpvote ? resolve(this.cacheService._data['liked']) :
                        resolve(this.cacheService._data['unliked']);
        });
    }

    updateVotesMap(id, author, vote) {
        this.subscriptions.push(
            this.questionService.updateQuestionVoteCount(id, author, vote)
                .subscribe(() => {
                    if (!this.isDetailsPage) { this.votesMap.set(id, this.votesMap.get(id) + vote); }
                })
        );
    }

    getLikedAndUnlikedPosts() {
        if (!this.cacheService._data['liked'] ||
            !this.cacheService._data['unliked']) {
            this.cacheService.getLikedPosts();
            this.cacheService.getUnlikedPosts();
        }

        const sub1 = this.cacheService._data['liked'].subscribe(res => {
            this.likedQuestions = res.posts ? res.posts : [];
        });
        const sub2 = this.cacheService._data['unliked'].subscribe(res => {
            this.dislikedQuestions = res.posts ? res.posts : [];
        });

        this.subscriptions.push(sub1, sub2);
    }
}
