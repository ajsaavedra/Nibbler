import { Injectable } from '@angular/core';
import { QuestionService } from './questions.service';
import { LocationService } from './locations.service';

@Injectable()
export class CacheService {
    _data;

    constructor(private questionService: QuestionService,
                private locationService: LocationService) {
        this._data = {};
    }

    getQuestions() {
        this._data['questions'] = this.questionService.getAllQuestions().shareReplay();
    }

    getQuestionById(id) {
        if (!this._data['question']) {
            this._data['question'] = {};
        }
        this._data['question'][id] = this.questionService.getQuestionById(id).shareReplay();
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
