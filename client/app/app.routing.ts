import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LocationsComponent } from './locations/locations.component';
import { LocationDetailsComponent } from './locations/location-details.component';
import { LocationReviewComponent } from './locations/location-review.component';
import { LoginComponent } from './accounts/login.component';
import { SignupComponent } from './accounts/signup.component';
import { ProfileComponent } from './accounts/profile.component';

const routes: Routes = [
    { path: '', component: AppComponent },
    { path: 'locations', component: LocationsComponent },
    { path: 'locations/:id', component: LocationDetailsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'profile/:username', component: ProfileComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})

export class AppRoutingModule {}

export const routingComponents = [
    AppComponent,
    NavigationComponent,
    LocationsComponent,
    LocationDetailsComponent,
    LocationReviewComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent
];