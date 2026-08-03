import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { App } from './app';
import { AppRoutingModule } from './app-routing-module';

import { AdminGameForm } from './components/admin-game-form/admin-game-form';
import { AdminMatchForm } from './components/admin-match-form/admin-match-form';
import { AdminMatchResultForm } from './components/admin-match-result-form/admin-match-result-form';
import { AdminTournamentForm } from './components/admin-tournament-form/admin-tournament-form';
import { RecentActivityFeed } from './components/recent-activity-feed/recent-activity-feed';
import { TournamentCard } from './components/tournament-card/tournament-card';

import { authInterceptor } from './interceptors/auth-interceptor';

import { Admin } from './pages/admin/admin';
import { CreateTeam } from './pages/create-team/create-team';
import { Games } from './pages/games/games';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Matches } from './pages/matches/matches';
import { Profile } from './pages/profile/profile';
import { Register } from './pages/register/register';
import { TeamDetails } from './pages/team-details/team-details';
import { Teams } from './pages/teams/teams';
import { TournamentDetails } from './pages/tournament-details/tournament-details';
import { Tournaments } from './pages/tournaments/tournaments';

import { TournamentEffects } from './store/tournament/tournament.effects';
import {
  tournamentFeatureKey,
  tournamentReducer,
} from './store/tournament/tournament.reducer';

@NgModule({
  declarations: [
    App,
    Home,
    Tournaments,
    TournamentCard,
    TournamentDetails,
    Teams,
    TeamDetails,
    Games,
    Login,
    Register,
    Profile,
    Admin,
    AdminGameForm,
    AdminTournamentForm,
    CreateTeam,
    Matches,
    AdminMatchForm,
    AdminMatchResultForm,
    RecentActivityFeed,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,

    StoreModule.forRoot({
      [tournamentFeatureKey]: tournamentReducer,
    }),

    EffectsModule.forRoot([TournamentEffects]),

    StoreDevtoolsModule.instrument({
      maxAge: 25,
    }),
  ],
  providers: [provideHttpClient(withInterceptors([authInterceptor]))],
  bootstrap: [App],
})
export class AppModule {}