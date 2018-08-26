import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { GlobalEventsManager } from '../GlobalEventsManager';

@Component({
    selector: 'paginator',
    templateUrl: './app/common/pagination.component.html'
})

export class PaginationComponent implements OnDestroy {
    @Output() page = new EventEmitter<number>();
    @Output() limit = new EventEmitter<number>();

    private currentPage;
    private subscription;

    constructor(private globalEventsManager: GlobalEventsManager) {
        this.subscription = this.globalEventsManager.pageResetEmitter
            .subscribe(pg => { console.log(pg); this.currentPage = pg; });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    public fetchNextPage() {
        this.page.emit(++this.currentPage);
    }

    public fetchPrevPage() {
        this.page.emit(--this.currentPage);
    }

    public fetchMoreResults(num: number) {
        this.currentPage = 0;
        this.limit.emit(num);
        this.page.emit(0);
    }
}
