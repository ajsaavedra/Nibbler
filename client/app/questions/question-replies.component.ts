import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { QuestionService } from '../services/questions.service';
import { CacheService } from '../services/cache.service';

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
    private likedReplies;
    private unlikedReplies;
    @Input() question: any;

   constructor(private questionService: QuestionService,
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
}
