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
  ],
  imports: [BrowserModule, CommonModule, AppRoutingModule, FormsModule],
  providers: [provideHttpClient(withInterceptors([authInterceptor]))],
  bootstrap: [App],
})
export class AppModule {}
