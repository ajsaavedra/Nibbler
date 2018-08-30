import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    template: `
        <navigator></navigator>
        <router-outlet></router-outlet>
        <footer class="container">
            <div class="text-center">
                <img src="{{ butterfly }}" title="&copy; {{ date }}">
            </div>
        </footer>
    `
})

export class AppComponent {
    private butterfly: any = require('../assets/images/butterfly-center.svg');
    private date: number = new Date().getFullYear();
}
