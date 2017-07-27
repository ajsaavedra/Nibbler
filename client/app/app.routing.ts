import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LocationsComponent } from './locations/locations.component';
import { LocationDetailsComponent } from './locations/location-details.component';
import { LocationReviewComponent } from './locations/location-review.component';
import { LoginComponent } from './accounts/login.component';
import { SignupComponent } from './accounts/signup.component';

const routes: Routes = [
    { path: '', component: AppComponent },
    { path: 'locations', component: LocationsComponent },
    { path: 'locations/:id', component: LocationDetailsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})

export class AppRoutingModule {}

export const routingComponents = [
    AppComponent,
    LocationsComponent,
    LocationDetailsComponent,
    LocationReviewComponent,
    LoginComponent,
    SignupComponent
];