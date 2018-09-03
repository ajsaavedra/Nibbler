import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CacheService } from '../services/cache.service';
import { GlobalEventsManager } from '../GlobalEventsManager';

@Component({
    templateUrl: './app/questions/questions.component.html',
    selector: 'nibbler-questions',
})

export class QuestionsComponent implements OnInit, OnDestroy {
    private questions = [];
    private subscriptions = [];
    private votesMap = new Map<string, number>();
    private field: string;

    constructor(
        private route: ActivatedRoute,
        private cacheService: CacheService,
        private globalEventsManager: GlobalEventsManager
    ) {}

    ngOnInit() {
        const sub = this.route.params.map(params => params['field'])
            .switchMap(field => {
                this.field = field ? field : 'questions';
                return this.globalEventsManager.pageResetEmitter;
            }).subscribe(pg => {
                const limit = this.globalEventsManager.getLimitNumber();
                this.cacheService.setCacheForQuestionType(this.field, limit, pg * limit);
                this.getCacheSubscription();
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
}
