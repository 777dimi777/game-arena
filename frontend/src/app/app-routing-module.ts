import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Teams } from './pages/teams/teams';
import { Home } from './pages/home/home';
import { Tournaments } from './pages/tournaments/tournaments';
import { TournamentDetails } from './pages/tournament-details/tournament-details';
import { Games } from './pages/games/games';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Profile } from './pages/profile/profile';
import { authGuard } from './guards/auth-guard';
import { Admin } from './pages/admin/admin';
import { adminGuard } from './guards/admin-guard';
import { CreateTeam } from './pages/create-team/create-team';
const routes: Routes = [
  {
    path: '',
    component: Home,
    pathMatch: 'full',
  },
  {
    path: 'tournaments',
    component: Tournaments,
  },
  {
    path: 'tournaments/:id',
    component: TournamentDetails,
  },
  {
    path: 'teams',
    component: Teams,
  },
  {
    path: 'games',
    component: Games,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    component: Admin,
    canActivate: [adminGuard],
  },
  {
  path: 'create-team',
  component: CreateTeam,
  canActivate: [authGuard],
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
