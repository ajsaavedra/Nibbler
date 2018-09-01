import { Component, Input } from '@angular/core';

@Component({
    selector: 'nibbler-select-control-component',
    template: `
        <select class="form-control" (change)="onChange($event.target.value)">
            <option selected>{{ label }}</option>
            <option *ngFor='let item of list' value="{{item}}">{{ item }}</option>
        </select>
    `
})

export class SelectControlComponent {
    @Input() onChange: Function;
    @Input() label: string;
    @Input() list: any[];
}
