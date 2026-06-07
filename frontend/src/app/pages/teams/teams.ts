import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { Team } from '../../models/team';
import { TeamService } from '../../services/team';

@Component({
  selector: 'app-teams',
  standalone: false,
  templateUrl: './teams.html',
  styleUrl: './teams.scss',
})
export class Teams {
  teams$: Observable<Team[]>;

  constructor(private readonly teamService: TeamService) {
    this.teams$ = this.teamService.getAll();
  }
}