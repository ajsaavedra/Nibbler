import { AbstractControl } from '@angular/forms';

export function ValidateDiet(control: AbstractControl) {
    return { selected: control.value };
}
