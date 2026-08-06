import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { catchError, finalize, Observable, of, shareReplay } from 'rxjs';

import { Team } from '../../models/team';
import { TeamService } from '../../services/team';

@Component({ selector: 'app-teams', standalone: false, templateUrl: './teams.html', styleUrl: './teams.scss' })
export class Teams {
  loading = true;
  errorMessage = '';
  teams$: Observable<Team[]>;

  constructor(private readonly teamService: TeamService) {
    this.teams$ = this.teamService.getAll().pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message ?? 'Failed to load teams.';
        return of([]);
      }),
      finalize(() => { this.loading = false; }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  trackById(_index: number, team: Team): number { return team.id; }
}
