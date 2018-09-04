import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs';

@Injectable()
export class DialogService {
    private _active: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public activeEmitter: Observable<boolean> = this._active.asObservable();
    private _message: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    public messageEmitter: Observable<string> = this._message.asObservable();

    constructor() {}

    public toggleActive(toggle: boolean) {
        this._active.next(toggle);
    }

    public setMessage(message: string) {
        this._message.next(message);
    }

    public status() {
        return this._active.getValue();
    }

    public getMessage() {
        return this._message.getValue();
    }
}
