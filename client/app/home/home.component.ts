import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    templateUrl: './app/home/home.component.html'
})

export class HomeComponent {
    private basket = require('../../assets/images/groceries.svg');
}