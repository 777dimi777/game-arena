import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, finalize, map, Observable, of, shareReplay, switchMap } from 'rxjs';

import { Match } from '../../models/match';
import { TeamProfile } from '../../models/team-profile';
import { TeamService } from '../../services/team';

@Component({
  selector: 'app-team-details',
  standalone: false,
  templateUrl: './team-details.html',
  styleUrl: './team-details.scss',
})
export class TeamDetails {
  loading = true;
  errorMessage = '';
  profile$: Observable<TeamProfile | null>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly teamService: TeamService,
  ) {
    this.profile$ = this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((id) => {
        this.loading = true;
        this.errorMessage = '';

        if (!Number.isInteger(id) || id <= 0) {
          this.loading = false;
          this.errorMessage = 'Invalid team ID.';
          return of(null);
        }

        return this.teamService.getProfile(id).pipe(
          catchError((error: HttpErrorResponse) => {
            const message = error.error?.message;
            this.errorMessage = Array.isArray(message)
              ? message.join(', ')
              : (message ?? 'Failed to load team profile.');
            return of(null);
          }),
          finalize(() => {
            this.loading = false;
          }),
        );
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  getMatchResult(match: Match): string {
    return match.scoreA !== null && match.scoreA !== undefined &&
      match.scoreB !== null && match.scoreB !== undefined
      ? `${match.scoreA} : ${match.scoreB}`
      : '- : -';
  }

  getOpponentName(match: Match, teamId: number): string {
    return match.teamA.id === teamId ? match.teamB.name : match.teamA.name;
  }

  didTeamWin(match: Match, teamId: number): boolean {
    return match.winner?.id === teamId;
  }

  getResultClass(match: Match, teamId: number): string {
    if (!match.winner) return 'neutral';
    return this.didTeamWin(match, teamId) ? 'win' : 'loss';
  }

  getDisplayStatus(match: Match): string {
    if (match.status === 'CANCELLED') return 'CANCELLED';
    if (match.status === 'FINISHED') return 'FINISHED';
    if (match.winner || (match.scoreA ?? 0) > 0 || (match.scoreB ?? 0) > 0) {
      return 'FINISHED';
    }
    return match.status;
  }
}
