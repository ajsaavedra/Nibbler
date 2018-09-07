import { Component, Input } from '@angular/core';

@Component({
    selector: 'nibbler-option-tags',
    template: `
        <span class="badge badge-pill badge-warning" *ngIf="options.gluten_free && !detailed">Gluten Free</span>
        <span class="badge badge-pill badge-warning" *ngIf="options.gluten_free && detailed">Gluten Free ({{ options.gluten_free }})</span>
        <span class="badge badge-pill badge-primary" *ngIf="options.vegan && !detailed">Vegan</span>
        <span class="badge badge-pill badge-primary" *ngIf="options.vegan && detailed">Vegan ({{ options.vegan }})</span>
        <span class="badge badge-pill badge-success" *ngIf="options.vegetarian && !detailed">Vegetarian</span>
        <span class="badge badge-pill badge-success" *ngIf="options.vegetarian && detailed">Vegetarian ({{ options.vegetarian }})</span>
        <span class="badge badge-pill badge-danger" *ngIf="options.soy_free && !detailed">Soy Free</span>
        <span class="badge badge-pill badge-danger" *ngIf="options.soy_free && detailed">Soy Free ({{ options.soy_free }})</span>
        <span class="badge badge-pill badge-info" *ngIf="options.nut_free && !detailed">Nut Free</span>
        <span class="badge badge-pill badge-info" *ngIf="options.nut_free && detailed">Nut Free ({{ options.nut_free }})</span>
    `
})

export class OptionTagsComponent {
    @Input() options;
    @Input() detailed: boolean;
}
