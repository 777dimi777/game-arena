import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { catchError, finalize, map, Observable, of, shareReplay } from 'rxjs';

import { Match } from '../../models/match';
import { MatchService } from '../../services/match';

@Component({
  selector: 'app-matches',
  standalone: false,
  templateUrl: './matches.html',
  styleUrl: './matches.scss',
})
export class Matches {
  loading = true;
  errorMessage = '';
  matches$: Observable<Match[]>;
  liveMatches$: Observable<Match[]>;
  upcomingMatches$: Observable<Match[]>;
  finishedMatches$: Observable<Match[]>;
  cancelledMatches$: Observable<Match[]>;

  constructor(private readonly matchService: MatchService) {
    this.matches$ = this.matchService.getAll().pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message ?? 'Failed to load matches.';
        return of([]);
      }),
      finalize(() => { this.loading = false; }),
      shareReplay({
        bufferSize: 1,
        refCount: true,
      }),
    );

    this.liveMatches$ = this.matches$.pipe(
      map((matches) =>
        matches.filter((match) => this.getDisplayStatus(match) === 'LIVE'),
      ),
    );

    this.upcomingMatches$ = this.matches$.pipe(
      map((matches) =>
        matches
          .filter((match) => this.getDisplayStatus(match) === 'SCHEDULED')
          .sort(
            (a, b) =>
              this.getScheduledTime(a, Number.POSITIVE_INFINITY) -
              this.getScheduledTime(b, Number.POSITIVE_INFINITY),
          ),
      ),
    );

    this.finishedMatches$ = this.matches$.pipe(
      map((matches) =>
        matches
          .filter((match) => this.getDisplayStatus(match) === 'FINISHED')
          .sort(
            (a, b) =>
              this.getScheduledTime(b, Number.NEGATIVE_INFINITY) -
              this.getScheduledTime(a, Number.NEGATIVE_INFINITY),
          ),
      ),
    );

    this.cancelledMatches$ = this.matches$.pipe(
      map((matches) =>
        matches.filter((match) => this.getDisplayStatus(match) === 'CANCELLED'),
      ),
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

  trackById(_index: number, match: Match): number { return match.id; }

  private getScheduledTime(match: Match, fallback: number): number {
    if (!match.scheduledAt) {
      return fallback;
    }

    const scheduledTime = new Date(match.scheduledAt).getTime();
    return Number.isNaN(scheduledTime) ? fallback : scheduledTime;
  }
}
