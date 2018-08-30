import { AbstractControl } from '@angular/forms';

export class PasswordValidation {
    static passwordsMatch(AC: AbstractControl) {
        let password = AC.get('password').value;
        let confirmation = AC.get('confirmation').value;

        password !== confirmation ? AC.get('confirmation').setErrors({ PasswordMatch: true }) : null;
    }
}