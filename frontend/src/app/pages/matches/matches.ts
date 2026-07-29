import { Component } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

import { Match } from '../../models/match';
import { MatchService } from '../../services/match';

@Component({
  selector: 'app-matches',
  standalone: false,
  templateUrl: './matches.html',
  styleUrl: './matches.scss',
})
export class Matches {
  matches$: Observable<Match[]>;
  liveMatches$: Observable<Match[]>;
  upcomingMatches$: Observable<Match[]>;
  finishedMatches$: Observable<Match[]>;
  cancelledMatches$: Observable<Match[]>;

  constructor(private readonly matchService: MatchService) {
    this.matches$ = this.matchService.getAll().pipe(
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
    const hasResult =
      match.scoreA !== null &&
      match.scoreA !== undefined &&
      match.scoreB !== null &&
      match.scoreB !== undefined &&
      (match.scoreA > 0 || match.scoreB > 0);

    if (match.winner || hasResult) {
      return 'FINISHED';
    }

    return match.status;
  }

  private getScheduledTime(match: Match, fallback: number): number {
    if (!match.scheduledAt) {
      return fallback;
    }

    const scheduledTime = new Date(match.scheduledAt).getTime();
    return Number.isNaN(scheduledTime) ? fallback : scheduledTime;
  }
}
