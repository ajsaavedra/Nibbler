import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HomeComponent } from './home/home.component';
import { LocationsComponent } from './locations/locations.component';
import { LocationDetailsComponent } from './locations/location-details.component';
import { LocationReviewComponent } from './locations/location-review.component';
import { LocationAddComponent } from './locations/location-add.component';
import { QuestionsCardComponent } from './questions/questions-card.component';
import { QuestionsComponent } from './questions/questions.component';
import { QuestionDetailsComponent } from './questions/question-details.component';
import { LoginComponent } from './accounts/login.component';
import { SignupComponent } from './accounts/signup.component';
import { ProfileComponent } from './accounts/profile.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'locations', component: LocationsComponent },
    { path: 'locations/:id', component: LocationDetailsComponent },
    { path: 'add-location', component: LocationAddComponent },
    {
        path: 'questions',
        component: QuestionsCardComponent,
        children: [
            {
                path: '',
                component: QuestionsComponent,
                pathMatch: 'full'
            }
        ]
    },
    { path: 'questions/:id', component: QuestionDetailsComponent },
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
    HomeComponent,
    LocationsComponent,
    LocationDetailsComponent,
    LocationReviewComponent,
    LocationAddComponent,
    QuestionsCardComponent,
    QuestionsComponent,
    QuestionDetailsComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent
];
