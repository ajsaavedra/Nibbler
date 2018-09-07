import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs';

@Injectable()
export class EditDialogService {
    private _active: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public activeEmitter: Observable<boolean> = this._active.asObservable();

    constructor() {}

    public toggleActive(toggle: boolean) {
        this._active.next(toggle);
    }

    public status() {
        return this._active.getValue();
    }
}
