import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth-interceptor';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Home } from './pages/home/home';
import { Tournaments } from './pages/tournaments/tournaments';
import { TournamentCard } from './components/tournament-card/tournament-card';
import { TournamentDetails } from './pages/tournament-details/tournament-details';
import { Teams } from './pages/teams/teams';
import { Games } from './pages/games/games';
import { FormsModule } from '@angular/forms';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Profile } from './pages/profile/profile';
import { Admin } from './pages/admin/admin';
import { AdminGameForm } from './components/admin-game-form/admin-game-form';
import { AdminTournamentForm } from './components/admin-tournament-form/admin-tournament-form';
import { CreateTeam } from './pages/create-team/create-team';
import { Matches } from './pages/matches/matches';
import { AdminMatchForm } from './components/admin-match-form/admin-match-form';
import { AdminMatchResultForm } from './components/admin-match-result-form/admin-match-result-form';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
@NgModule({
  declarations: [
    App,
    Home,
    Tournaments,
    TournamentCard,
    TournamentDetails,
    Teams,
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
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
    }),
  ],
  providers: [provideHttpClient(withInterceptors([authInterceptor]))],
  bootstrap: [App],
})
export class AppModule {}
