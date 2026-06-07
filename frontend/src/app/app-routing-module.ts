import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Teams } from './pages/teams/teams';
import { Home } from './pages/home/home';
import { Tournaments } from './pages/tournaments/tournaments';
import { TournamentDetails } from './pages/tournament-details/tournament-details';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}