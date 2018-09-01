import { AbstractControl } from '@angular/forms';

export class PasswordValidation {
    static passwordsMatch(AC: AbstractControl) {
        const password = AC.get('password').value;
        const confirmation = AC.get('confirmation').value;

        password !== confirmation ? AC.get('confirmation').setErrors({ PasswordMatch: true }) : null;
    }
}
