import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule, routingComponents } from './app.routing';
import { GlobalEventsManager } from './GlobalEventsManager';
import { LocationsFilterPipe } from './locations/locations-filter.pipe';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule
     ],
    declarations: [
        AppComponent,
        routingComponents,
        LocationsFilterPipe
    ],
    providers: [ GlobalEventsManager ],
    bootstrap: [ AppComponent ]
})

export class AppModule {}
