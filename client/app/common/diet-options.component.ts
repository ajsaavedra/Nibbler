import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
    selector: 'nibbler-diet-options-component',
    template: `
    <nibbler-checkbox-control-component [control]="controls['gluten-free']"
        title="Gluten Free" id="glutenFreeCheckbox">
    </nibbler-checkbox-control-component>
    <nibbler-checkbox-control-component [control]="controls['vegetarian']"
        title="Vegetarian" id="vegetarianCheckbox">
    </nibbler-checkbox-control-component>
    <nibbler-checkbox-control-component [control]="controls['vegan']"
        title="Vegan" id="veganCheckbox">
    </nibbler-checkbox-control-component>
    <nibbler-checkbox-control-component [control]="controls['soy-free']"
        title="Soy Free" id="soyFreeCheckbox">
    </nibbler-checkbox-control-component>
    <nibbler-checkbox-control-component [control]="controls['nut-free']"
        title="Nut Free" id="nutFreeCheckbox">
    </nibbler-checkbox-control-component>
    `
})

export class DietOptionsComponent {
    @Input() controls: AbstractControl;
}
