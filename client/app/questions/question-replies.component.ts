import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { QuestionService } from '../services/questions.service';
import { TokenService } from '../services/token.service';
import { CacheService } from '../services/cache.service';
import { AccountsService } from '../services/accounts.service';
import { DialogService } from '../services/dialog.service';

@Component({
    selector: 'nibbler-question-replies',
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
    private uname;

    @Input() question: any;

   constructor(
       private accountsService: AccountsService,
       private questionService: QuestionService,
       private cacheService: CacheService,
       private tokenService: TokenService,
       private fb: FormBuilder,
       private dialog: DialogService) {
            this.replyForm = fb.group({
                'replyText': [null, Validators.required]
            });
            this.editForm = fb.group({
                'editText': [null, Validators.required]
            });
    }

    ngOnInit() {
        if (this.tokenService.tokenExists()) {
            this.uname = this.tokenService.getUsername();
            this.questionId = this.question._id;
            this.getReplies();

            if (!this.cacheService._data['postHelpfulComments']) {
                this.cacheService.getPostHelpfulComments(this.questionId);
            }
            const sub = this.cacheService._data['postHelpfulComments'].subscribe(res => {
                if (res.comments && res.comments[this.questionId]) {
                    this.helpfulCommentsMap = res.comments[this.questionId];
                } else {
                    this.helpfulCommentsMap = [];
                }
            });
            this.subscriptions.push(sub);
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.dialog.toggleActive(false);
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
        if (this.uname && true) {
            const text = this.replyForm.get('replyText').value;

            let reply = [];
            const sub = this.questionService.postQuestionReply(this.questionId, this.uname, text)
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
            this.dialog.setMessage('You must sign in to reply to this question.');
            this.dialog.toggleActive(true);
        }
    }

    replyBelongsToUser(reply) {
        return reply.author === this.uname;
    }

    deleteReply(reply) {
        return this.questionService.deleteQuestionReply(this.questionId, reply._id)
                    .subscribe(res => this.updateCachedReplies(this.questionId, reply._id));
    }

    isHelpful(reply_id) {
        if (this.uname) {
            return this.helpfulCommentsMap && this.helpfulCommentsMap.includes(reply_id);
        }
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
        if (this.uname && true) {
            this.updateReplyVotes(reply_id, isHelpful);
            this.updateSavedReplies(this.uname, reply_id, isHelpful);
        } else {
            this.dialog.setMessage('Log in to save helpful comments!');
            this.dialog.toggleActive(true);
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
            .saveHelpfulComment(this.questionId, reply_id, isHelpful)
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
