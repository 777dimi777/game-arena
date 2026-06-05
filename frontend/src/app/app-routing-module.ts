import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Tournaments } from './pages/tournaments/tournaments';
const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
  path: 'tournaments',
  component: Tournaments,
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}