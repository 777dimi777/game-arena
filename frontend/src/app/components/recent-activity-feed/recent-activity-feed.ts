import { Component } from '@angular/core';
import { catchError, combineLatest, finalize, map, Observable, of, shareReplay } from 'rxjs';

import { ActivityItem } from '../../models/activity-item';
import { Match } from '../../models/match';
import { Tournament } from '../../models/tournament';
import { MatchService } from '../../services/match';
import { TournamentService } from '../../services/tournament';

@Component({
  selector: 'app-recent-activity-feed',
  standalone: false,
  templateUrl: './recent-activity-feed.html',
  styleUrl: './recent-activity-feed.scss',
})
export class RecentActivityFeed {
  loading = true;
  errorMessage = '';
  activities$: Observable<ActivityItem[]>;

  constructor(
    private readonly matchService: MatchService,
    private readonly tournamentService: TournamentService,
  ) {
    const matches$ = this.matchService.getAll().pipe(
      catchError(() => {
        this.errorMessage = 'Some recent activity could not be loaded.';
        return of([] as Match[]);
      }),
    );
    const tournaments$ = this.tournamentService.getAll().pipe(
      catchError(() => {
        this.errorMessage = 'Some recent activity could not be loaded.';
        return of([] as Tournament[]);
      }),
    );

    this.activities$ = combineLatest([matches$, tournaments$]).pipe(
      map(([matches, tournaments]) => this.buildActivities(matches, tournaments)),
      finalize(() => { this.loading = false; }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  trackById(_index: number, activity: ActivityItem): string { return activity.id; }

  private buildActivities(matches: Match[], tournaments: Tournament[]): ActivityItem[] {
    return [
      ...matches.map((match) => this.createMatchActivity(match)),
      ...tournaments.map((tournament) => this.createTournamentActivity(tournament)),
    ].sort((a, b) => this.getTimeValue(b) - this.getTimeValue(a)).slice(0, 8);
  }

  private createMatchActivity(match: Match): ActivityItem {
    const status = this.getDisplayStatus(match);
    return {
      id: `match-${match.id}`,
      type: status === 'FINISHED' ? 'MATCH_FINISHED' : status === 'LIVE' ? 'MATCH_LIVE' : status === 'CANCELLED' ? 'MATCH_CANCELLED' : 'MATCH_SCHEDULED',
      title: this.getMatchTitle(match, status),
      subtitle: `${match.tournament.name} \u2022 ${match.tournament.game.name}`,
      timestamp: match.scheduledAt ?? null,
      statusLabel: status,
      icon: status === 'FINISHED' ? '\u2605' : status === 'LIVE' ? '\u25CF' : status === 'CANCELLED' ? '!' : '\u25F7',
      link: `/matches/${match.id}`,
    };
  }

  private createTournamentActivity(tournament: Tournament): ActivityItem {
    const status = tournament.status ?? 'OPEN';
    return {
      id: `tournament-${tournament.id}`,
      type: status === 'FINISHED' ? 'TOURNAMENT_FINISHED' : status === 'ONGOING' ? 'TOURNAMENT_ONGOING' : status === 'CANCELLED' ? 'TOURNAMENT_CANCELLED' : 'TOURNAMENT_OPEN',
      title: `${tournament.name} is ${status.toLowerCase()}`,
      subtitle: `${tournament.game.name} \u2022 ${tournament.maxTeams} teams`,
      timestamp: tournament.startDate ?? null,
      statusLabel: status,
      icon: status === 'FINISHED' ? '\u2691' : status === 'ONGOING' ? '\u26A1' : status === 'CANCELLED' ? '!' : '\u25C6',
      link: `/tournaments/${tournament.id}`,
    };
  }

  private getMatchTitle(match: Match, status: string): string {
    if (status === 'FINISHED' && match.winner) return `${match.winner.name} defeated ${match.winner.id === match.teamA.id ? match.teamB.name : match.teamA.name}`;
    if (status === 'FINISHED') return `${match.teamA.name} vs ${match.teamB.name} finished`;
    if (status === 'LIVE') return `${match.teamA.name} vs ${match.teamB.name} is live`;
    if (status === 'CANCELLED') return `${match.teamA.name} vs ${match.teamB.name} was cancelled`;
    return `${match.teamA.name} vs ${match.teamB.name} is scheduled`;
  }

  private getDisplayStatus(match: Match): string {
    if (match.status === 'CANCELLED') return 'CANCELLED';
    if (match.status === 'FINISHED') return 'FINISHED';
    if (match.winner || (match.scoreA ?? 0) > 0 || (match.scoreB ?? 0) > 0) return 'FINISHED';
    return match.status;
  }

  private getTimeValue(activity: ActivityItem): number {
    if (!activity.timestamp) return 0;
    const time = new Date(activity.timestamp).getTime();
    return Number.isNaN(time) ? 0 : time;
  }
}
