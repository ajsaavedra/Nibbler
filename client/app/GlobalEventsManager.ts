import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GlobalEventsManager {
    private _showUserNavBar: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    public showUserNavBarEmitter: Observable<boolean> = this._showUserNavBar.asObservable();

    private _showUserProfileTab: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    public showUserProfileTabEmitter: Observable<string> = this._showUserProfileTab.asObservable();

    private page: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    public pageResetEmitter: Observable<number> = this.page.asObservable();

    private limit: BehaviorSubject<number> = new BehaviorSubject<number>(10);
    public limitResetEmitter: Observable<number> = this.limit.asObservable();

    constructor() {}

    showUserNavBar(show: boolean) {
        this._showUserNavBar.next(show);
    }

    getShowValue() {
        return this._showUserNavBar.getValue();
    }

    setUserProfileTab(uname: string) {
        this._showUserProfileTab.next(uname);
    }

    getUserProfiletab() {
        return this._showUserProfileTab.getValue();
    }

    setPageNumber(page: number) {
        this.page.next(page);
    }

    setLimitNumber(limit: number) {
        this.limit.next(limit);
    }

    getPageNumber() {
        return this.page.getValue();
    }

    getLimitNumber() {
        return this.limit.getValue();
    }
}
