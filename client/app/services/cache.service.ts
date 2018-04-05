import { Injectable } from '@angular/core';
import { QuestionService } from './questions.service';
import { LocationService } from './locations.service';
import { AccountsService } from './accounts.service';

@Injectable()
export class CacheService {
    _data;

    constructor(private questionService: QuestionService,
                private locationService: LocationService,
                private accountsService: AccountsService) {
        this._data = {};
    }

    getQuestions() {
        this._data['questions'] = this.questionService.getAllQuestions().shareReplay();
    }

    getQuestionsByPopularity() {
        this._data['popularity'] = this.questionService.getAllPopularQuestions().shareReplay();
    }

    getQuestionById(id) {
        if (!this._data['question']) {
            this._data['question'] = {};
        }
        this._data['question'][id] = this.questionService.getQuestionById(id).shareReplay();
    }

    getResolvedQuestions() {
        this._data['resolved'] = this.questionService.getResolvedQuestions().shareReplay();
    }

    getLikedPosts() {
        this._data['liked'] = this.accountsService.getLikedPosts().shareReplay();
    }

    getUnlikedPosts() {
        this._data['unliked'] = this.accountsService.getUnlikedPosts().shareReplay();
    }

    getPostHelpfulComments(post) {
        this._data['postHelpfulComments'] = this.accountsService.getSavedHelpfulCommentsForPost(post).shareReplay();
    }

    getHelpfulComments() {
        this._data['helpfulComments'] = this.accountsService.getSavedHelpfulComments().shareReplay();
    }

    getLocations() {
        this._data['locations'] = this.locationService.getNearbyLocations().shareReplay();
    }

    getLocationById(id) {
        if (!this._data['location']) {
            this._data['location'] = {};
        }
        this._data['location'][id] = this.locationService.getLocationById(id).shareReplay();
    }
}
