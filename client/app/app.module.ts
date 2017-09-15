import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule, routingComponents } from './app.routing';
import { GlobalEventsManager } from './GlobalEventsManager';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule
     ],
    declarations: [
        AppComponent,
        routingComponents
    ],
    providers: [ GlobalEventsManager ],
    bootstrap: [ AppComponent ]
})

export class AppModule {}