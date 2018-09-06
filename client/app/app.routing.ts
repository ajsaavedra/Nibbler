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
import { QuestionRepliesComponent } from './questions/question-replies.component';
import { QuestionAddComponent } from './questions/question-add.component';
import { LoginComponent } from './auth/login.component';
import { SignupComponent } from './auth/signup.component';
import { ProfileComponent } from './accounts/profile.component';
import { ProfileSavedPostsComponent } from './accounts/profile.saved-posts.component';
import { ProfileSavedCommentsComponent } from './accounts/profile.saved-comments.component';
import { ProfileVotesCardComponent } from './accounts/profile.votes-card.component';
import { ProfileVotedPostsComponent } from './accounts/profile.voted-posts.component';
import { ProfileQuestionsComponent } from './accounts/profile.questions.component';
import { ProfileReviewsComponent } from './accounts/profile.reviews.component';
import { PaginationComponent } from './common/pagination.component';
import { VotingComponent } from './common/voting.component';
import { FieldControlComponent } from './common/field.control.component';
import { CheckboxControlComponent } from './common/checkbox.control.component';
import { SelectControlComponent } from './common/select.contol.component';
import { DietOptionsComponent } from './common/diet-options.component';
import { DialogComponent } from './common/dialog.component';
import { OptionTagsComponent } from './common/option-tags.component';

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
    { path: 'add-question', component: QuestionAddComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'profile/:username', component: ProfileComponent },
    { path: 'profile/:username/questions', component: ProfileQuestionsComponent },
    { path: 'profile/:username/reviews', component: ProfileReviewsComponent },
    { path: 'profile/:username/posts/favorite', component: ProfileSavedPostsComponent },
    { path: 'profile/:username/posts/helpful_answers', component: ProfileSavedCommentsComponent},
    {
        path: 'profile/:username/posts/voted',
        component: ProfileVotesCardComponent,
        children: [
            {
                path: '',
                component: ProfileVotedPostsComponent,
                pathMatch: 'full'
            }
        ]
    }
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
    QuestionAddComponent,
    QuestionRepliesComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    ProfileQuestionsComponent,
    ProfileReviewsComponent,
    ProfileSavedPostsComponent,
    ProfileSavedCommentsComponent,
    ProfileVotesCardComponent,
    ProfileVotedPostsComponent,
    PaginationComponent,
    VotingComponent,
    FieldControlComponent,
    CheckboxControlComponent,
    SelectControlComponent,
    DietOptionsComponent,
    DialogComponent,
    OptionTagsComponent
];
