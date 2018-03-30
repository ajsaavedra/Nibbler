import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';
import { AppComponent } from './app.component';
import { AppRoutingModule, routingComponents } from './app.routing';
import { GlobalEventsManager } from './GlobalEventsManager';
import { CacheService } from './services/cache.service';
import { QuestionService } from './services/questions.service';
import { LocationService } from './services/locations.service';
import { LocationsFilterPipe } from './locations/locations-filter.pipe';
import { AccountsService } from './services/accounts.service';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        DragulaModule
     ],
    declarations: [
        AppComponent,
        routingComponents,
        LocationsFilterPipe
    ],
    providers: [
        GlobalEventsManager,
        CacheService,
        QuestionService,
        LocationService,
        AccountsService
    ],
    bootstrap: [ AppComponent ]
})

export class AppModule {}
