import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../services/questions.service';
import { AccountsService } from '../services/accounts.service';

@Component({
    templateUrl: './app/questions/question-details.component.html',
    providers: [ QuestionService, AccountsService ]
})

export class QuestionDetailsComponent implements OnInit, OnDestroy {
    private question: any;
    private sub: any;
    private questionId: any;
    private isFavorited = false;
    private accountSub: any;
    private user: any;
    private liked = false;
    private disliked = false;

    constructor(private route: ActivatedRoute,
                private questionService: QuestionService,
                private accountsService: AccountsService) {}

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.questionId = params['id'];
            this.questionService.getQuestionById(this.questionId).subscribe(question => this.question = question);
            this.getIsFavorited(this.questionId);
            this.getLikedAndUnlikedPosts(this.questionId);
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    getIsFavorited(id) {
        if (localStorage.getItem('username')) {
            this.accountSub =
                this.accountsService
                    .getUserSavedPosts(localStorage.getItem('username'))
                    .subscribe(res => {
                        this.isFavorited = res.posts && res.posts[id];
                    }, err => {
                        this.isFavorited = false;
                    });
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
        if (uname) {
            this.accountsService.saveLikedPostToUser(uname, question_id).subscribe(res => {
                this.liked = !this.liked;
                this.disliked = false;
            });
        }
    }

    unlike(question_id) {
        const uname = localStorage.getItem('username');
        if (uname) {
            this.accountsService.removeLikedPostFromUser(uname, question_id).subscribe(res => {
                this.disliked = !this.disliked;
                this.liked = false;
            });
        }
    }

    getLikedAndUnlikedPosts(id) {
        const uname = localStorage.getItem('username');
        if (uname && true) {
            this.accountsService.getLikedPosts(uname).subscribe(res => {
                this.liked = res.posts[id] && true;
            });
            this.accountsService.getUnlikedPosts(uname).subscribe(res => {
                this.disliked = res.posts[id] && true;
            });
        }
    }
}
