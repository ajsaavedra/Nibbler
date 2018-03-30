import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { QuestionService } from '../services/questions.service';
import { CacheService } from '../services/cache.service';
import { AccountsService } from '../services/accounts.service';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'question-replies',
    templateUrl: './app/questions/question-replies.component.html'
})

export class QuestionRepliesComponent implements OnInit, OnDestroy {
    private replyForm: FormGroup;
    private editForm: FormGroup;
    private editing = false;
    private replyTextToEdit;
    private subscriptions = [];
    private questionId;
    private replies;
    private helpfulCommentsMap = [];
    private votesMap = {};
    @Input() question: any;

   constructor(private accountsService: AccountsService,
               private questionService: QuestionService,
               private cacheService: CacheService,
               private fb: FormBuilder) {
        this.replyForm = fb.group({
            'replyText': [null, Validators.required]
        });
        this.editForm = fb.group({
            'editText': [null, Validators.required]
        });
    }

    ngOnInit() {
        this.questionId = this.question._id;
        this.getReplies();

        const uname = localStorage.getItem('username');
        if (uname && !this.cacheService._data['postHelpfulComments']) {
            this.cacheService.getPostHelpfulComments(uname, this.questionId);
        }
        const sub = this.cacheService._data['postHelpfulComments'].subscribe(res => {
            console.log('ZOMBIE', res);
            if (res.comments && res.comments[this.questionId]) {
                this.helpfulCommentsMap = res.comments[this.questionId];
            } else {
                this.helpfulCommentsMap = [];
            }
        });
        this.subscriptions.push(sub);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    updateCachedReplies(id, reply_id) {
        if (this.cacheService._data['question']) {
            const sub = this.cacheService._data['question'][id].subscribe(result => {
                result['replies'] = result['replies'].filter(item => item._id !== reply_id);
            });
            this.subscriptions.push(sub);
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

    isHelpful(reply_id) {
        return this.helpfulCommentsMap && this.helpfulCommentsMap.includes(reply_id);
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
                        this.toggleEditing(null);
                    }
                });
            });
        this.subscriptions.push(sub);
    }

    toggleEditing(reply) {
        this.editing = !this.editing;
        if (reply) {
            this.replyTextToEdit = reply.replyText;
        }
    }

    saveHelpfulComment(reply_id, isHelpful) {
        const uname = localStorage.getItem('username');
        if (uname && true) {
            this.updateReplyVotes(reply_id, isHelpful);
            this.updateSavedReplies(uname, reply_id, isHelpful);
        } else {
            alert('Log in to vote');
        }
    }

    updateReplyVotes(reply_id, isHelpful) {
        const sub = this.questionService
            .updateQuestionReplyVotes(this.questionId, reply_id, isHelpful)
            .switchMap(res => this.cacheService._data['question'][this.questionId])
            .subscribe(subResults => {
                const vote = isHelpful ? 1 : -1;
                subResults['replies'].filter(reply => reply._id === reply_id)[0].votes += vote;
                this.votesMap[reply_id] += vote;
            });
        this.subscriptions.push(sub);
    }

    updateSavedReplies(uname, reply_id, isHelpful) {
        const sub = this.accountsService
            .saveHelpfulComment(uname, this.questionId, reply_id, isHelpful)
            .switchMap(result => this.cacheService._data['postHelpfulComments'])
            .subscribe(subResult => {
                if (subResult['comments'][this.questionId] !== null) {
                    this.updateMappedHelpfulComments(reply_id, isHelpful);
                } else {
                    this.helpfulCommentsMap.push(reply_id);
                }
                subResult['comments'][this.questionId] = this.helpfulCommentsMap;
            });
        this.subscriptions.push(sub);
    }

    updateMappedHelpfulComments(reply_id, isHelpful) {
        if (isHelpful) {
            this.helpfulCommentsMap.push(reply_id);
        } else {
            this.helpfulCommentsMap = this.helpfulCommentsMap.filter(reply => {
                return reply_id !== reply;
            });
        }
    }

    getReplies() {
        if (this.cacheService._data['question'] && this.cacheService._data['question'][this.questionId]) {
            const sub = this.cacheService._data['question'][this.questionId].subscribe(result => {
                this.replies = result['replies'];
                this.replies.forEach(reply => {
                    this.votesMap[reply._id] = reply.votes;
                });
            });
            this.subscriptions.push(sub);
        }
    }
}
