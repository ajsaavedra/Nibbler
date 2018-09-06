import { Component, Input } from '@angular/core';

@Component({
    selector: 'nibbler-option-tags',
    template: `
        <span class="badge badge-pill badge-warning" *ngIf="options.gluten_free">Gluten-free</span>
        <span class="badge badge-pill badge-primary" *ngIf="options.vegan">Vegan</span>
        <span class="badge badge-pill badge-success" *ngIf="options.vegetarian">Vegetarian</span>
        <span class="badge badge-pill badge-danger" *ngIf="options.soy_free">Soy-free</span>
        <span class="badge badge-pill badge-info" *ngIf="options.nut_free">Nut-free</span>
    `
})

export class OptionTagsComponent {
    @Input() options;
}
