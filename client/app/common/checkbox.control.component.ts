import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
    selector: 'nibbler-checkbox-control-component',
    template: `
        <div class="form-check">
            <label class="form-check-label">
                <input class="form-check-input" type="checkbox" id="{{id}}" value="{{title}}" [formControl]="control">
                    {{ title }}
            </label>
        </div>
    `
})

export class CheckboxControlComponent {
    @Input() control: AbstractControl;
    @Input() title: string;
    @Input() id: string;
}
