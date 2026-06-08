import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
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
  ],
  imports: [BrowserModule, CommonModule, AppRoutingModule, FormsModule],
  providers: [provideHttpClient()],
  bootstrap: [App],
})
export class AppModule {}
