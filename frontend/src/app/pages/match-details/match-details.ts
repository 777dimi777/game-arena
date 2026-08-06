import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, finalize, map, Observable, of, shareReplay, switchMap } from 'rxjs';

import { Match } from '../../models/match';
import { MatchService } from '../../services/match';

@Component({
  selector: 'app-match-details',
  standalone: false,
  templateUrl: './match-details.html',
  styleUrl: './match-details.scss',
})
export class MatchDetails {
  loading = true;
  errorMessage = '';
  match$: Observable<Match | null>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly matchService: MatchService,
  ) {
    this.match$ = this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((id) => {
        this.loading = true;
        this.errorMessage = '';

        if (!Number.isInteger(id) || id <= 0) {
          this.loading = false;
          this.errorMessage = 'Invalid match ID.';
          return of(null);
        }

        return this.matchService.getById(id).pipe(
          catchError((error: HttpErrorResponse) => {
            const message = error.error?.message;
            this.errorMessage = Array.isArray(message)
              ? message.join(', ')
              : (message ?? 'Failed to load match.');
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

  getDisplayStatus(match: Match): string {
    if (match.status === 'CANCELLED') return 'CANCELLED';
    if (match.status === 'FINISHED') return 'FINISHED';
    if (match.winner || (match.scoreA ?? 0) > 0 || (match.scoreB ?? 0) > 0) {
      return 'FINISHED';
    }
    return match.status;
  }

  getMatchResult(match: Match): string {
    return match.scoreA !== null && match.scoreA !== undefined &&
      match.scoreB !== null && match.scoreB !== undefined
      ? `${match.scoreA} : ${match.scoreB}`
      : '- : -';
  }

  isTeamWinner(match: Match, teamId: number): boolean {
    return match.winner?.id === teamId;
  }

  getWinnerText(match: Match): string {
    if (match.winner) return match.winner.name;
    return this.getDisplayStatus(match) === 'FINISHED'
      ? 'Draw / No winner'
      : 'Winner pending';
  }

  getRoomTitle(match: Match): string {
    const status = this.getDisplayStatus(match);
    if (status === 'LIVE') return 'Live match room';
    if (status === 'FINISHED') return 'Match summary';
    if (status === 'CANCELLED') return 'Cancelled match';
    return 'Upcoming match';
  }
}
