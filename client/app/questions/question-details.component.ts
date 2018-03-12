import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { QuestionService } from '../services/questions.service';
import { AccountsService } from '../services/accounts.service';
import { CacheService } from '../services/cache.service';

@Component({
    templateUrl: './app/questions/question-details.component.html',
    providers: [ QuestionService, AccountsService ]
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
    private editing = false;

    private replyForm: FormGroup;
    private editForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private questionService: QuestionService,
        private accountsService: AccountsService,
        private cacheService: CacheService,
        private fb: FormBuilder
    ) {
        this.replyForm = fb.group({
            'replyText': [null, Validators.required]
        });
        this.editForm = fb.group({
            'editText': [null, Validators.required]
        });
    }

    ngOnInit() {
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

    updateCachedReplies(id, reply_id) {
        if (this.cacheService._data['question']) {
            const sub = this.cacheService._data['question'][id].subscribe(result => {
                result['replies'] = result['replies'].filter(item => item._id !== reply_id);
            });
            this.subscriptions.push(sub);
        }
    }

    getIsFavorited(id) {
        if (localStorage.getItem('username')) {
            const accountSub =
                this.accountsService
                    .getUserSavedPosts(localStorage.getItem('username'))
                    .subscribe(res => {
                        this.isFavorited = res.posts && res.posts[id];
                    }, err => {
                        this.isFavorited = false;
                    });
            this.subscriptions.push(accountSub);
        }
    }

    toggleFavorite() {
        if (localStorage.getItem('username') && !this.isFavorited) {
            this.accountsService.savePostToUser(localStorage.getItem('username'), this.questionId)
                .subscribe(res => this.isFavorited = true, err => this.isFavorited = false);
        } else if (localStorage.getItem('username') && this.isFavorited) {
            this.accountsService.removePostFromUser(localStorage.getItem('username'), this.questionId)
                .subscribe(res => this.isFavorited = false);
        } else {
            alert('You must be logged in to save a post.');
        }
    }

    like(question_id) {
        const uname = localStorage.getItem('username');
        let sub;
        if (uname) {
            if (this.liked) {
                this.updateCachedVotes(question_id, -1);
                sub = this.questionService.updateQuestionVoteCount(question_id, -1).subscribe(res => this.votes -= 1);
            } else if (this.disliked) {
                this.updateCachedVotes(question_id, 2);
                sub = this.questionService.updateQuestionVoteCount(question_id, 2).subscribe(res => this.votes += 2);
            } else {
                this.updateCachedVotes(question_id, 1);
                sub = this.questionService.updateQuestionVoteCount(question_id, 1).subscribe(res => this.votes += 1);
            }

            const sub2 = this.accountsService.saveLikedPostToUser(uname, question_id).subscribe(res => {
                this.liked = !this.liked;
                this.disliked = false;
            });

            this.subscriptions.push(sub, sub2);
        } else {
            alert('You must be a member to vote. Sign up today!');
        }
    }

    unlike(question_id) {
        const uname = localStorage.getItem('username');
        let sub;
        if (uname) {
            if (this.disliked) {
                this.updateCachedVotes(question_id, 1);
                sub = this.questionService.updateQuestionVoteCount(question_id, 1).subscribe(res => this.votes += 1);
            } else if (this.liked) {
                this.updateCachedVotes(question_id, -2);
                sub = this.questionService.updateQuestionVoteCount(question_id, -2).subscribe(res => this.votes -= 2);
            } else {
                this.updateCachedVotes(question_id, -1);
                sub = this.questionService.updateQuestionVoteCount(question_id, -1).subscribe(res => this.votes -= 1);
            }

            const sub2 = this.accountsService.removeLikedPostFromUser(uname, question_id).subscribe(res => {
                this.disliked = !this.disliked;
                this.liked = false;
            });

            this.subscriptions.push(sub, sub2);
        } else {
            alert('You must be a member to vote. Sign up today!');
        }
    }

    getLikedAndUnlikedPosts(id) {
        const uname = localStorage.getItem('username');
        if (uname && true) {
            const sub1 = this.accountsService.getLikedPosts(uname).subscribe(res => {
                this.liked = res.posts && res.posts[id] && true;
            });
            const sub2 = this.accountsService.getUnlikedPosts(uname).subscribe(res => {
                this.disliked = res.posts && res.posts[id] && true;
            });

            this.subscriptions.push(sub1, sub2);
        }
    }

    submitReply() {
        const uname = localStorage.getItem('username');
        if (uname && true) {
            const text = this.replyForm.get('replyText').value;

            let reply = [];
            const sub = this.questionService.postQuestionReply(this.questionId, uname, text)
                .do(res => reply = res)
                .flatMap(res => {
                    return this.cacheService._data['question'][this.questionId];
                })
                .subscribe(result => {
                    result['replies'].push(reply);
                    this.replyForm.get('replyText').setValue('');
                });
            this.subscriptions.push(sub);
        } else {
            alert('You must sign in to reply to this question.');
        }
    }

    replyBelongsToUser(reply) {
        return reply.author === localStorage.getItem('username');
    }

    deleteReply(reply) {
        return this.questionService.deleteQuestionReply(this.questionId, reply._id)
                    .subscribe(res => this.updateCachedReplies(this.questionId, reply._id));
    }

    submitEdit(reply) {
        const edit = this.editForm.get('editText').value;
        let updatedReply;
        const sub = this.questionService.editQuestionReply(this.questionId, reply._id, edit)
            .do(res => updatedReply = res)
            .flatMap(res => this.cacheService._data['question'][this.questionId])
            .subscribe(res => {
                res['replies'].forEach(item => {
                    if (item._id === updatedReply._id) {
                        item.replyText = updatedReply.replyText;
                        this.editForm.get('editText').setValue('');
                        this.toggleEditing();
                    }
                });
            });
        this.subscriptions.push(sub);
    }

    toggleEditing() {
        this.editing = !this.editing;
    }
}
