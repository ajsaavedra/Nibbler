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

    setCacheForQuestionType(field: string, limit: number, offset: number = 0) {
        this._data[field] = this.getQuestions(field, limit, offset);
    }

    getQuestions(field: string, limit: number, offset: number = 0) {
        switch (field) {
            case 'popularity':
                return this.questionService.getAllPopularQuestions().shareReplay();
            case 'resolved':
                return this.questionService.getResolvedQuestions().shareReplay();
            default:
                return this.questionService.getAllQuestions(limit, offset).shareReplay();
        }
    }

    getQuestionById(id) {
        if (!this._data['question']) {
            this._data['question'] = {};
        }
        this._data['question'][id] = this.questionService.getQuestionById(id).shareReplay();
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

    getLocations(limit: number, offset: number = 0, lon: number = -122.2903, lat: number = 37.8687) {
        this._data['locations'] = this.locationService.getNearbyLocations(limit, limit * offset, lon, lat).shareReplay();
    }

    getLocationById(id) {
        if (!this._data['location']) {
            this._data['location'] = {};
        }
        this._data['location'][id] = this.locationService.getLocationById(id).shareReplay();
    }
}
