import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
    selector: 'nibbler-field-control-component',
    template: `
        <div class="form-group">
            <input *ngIf="!textarea" type="{{type}}" class="form-control" name="{{name}}"
                [formControl]="control" placeholder="{{placeholder}}"/>
            <textarea *ngIf="textarea" class="form-control" name="{{type}}"
                [formControl]="control" placeholder="{{placeholder}}"></textarea>
            <div *ngIf="!hasRegex && control.hasError('required') && control.touched" class="alert alert-danger">
                {{ error || placeholder + ' required' }}
            </div>
            <div *ngIf="hasRegex && (control.hasError('pattern') || control.touched && control.hasError('required'))"
                class="alert alert-danger"> {{ error || placeholder + ' required' }}
            </div>
            <div *ngIf="name === 'confirmation' && control.touched && control.errors?.PasswordMatch"
                class="alert alert-danger"> {{ error }}
            </div>
        </div>
    `
})

export class FieldControlComponent {
    @Input() control: AbstractControl;
    @Input() placeholder: string;
    @Input() name: string;
    @Input() type = 'text';
    @Input() textarea: boolean;
    @Input() hasRegex = false;
    @Input() error = '';
}
