import { Component } from '@angular/core';
import { combineLatest, map, Observable, shareReplay } from 'rxjs';

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
  activities$: Observable<ActivityItem[]>;

  constructor(
    private readonly matchService: MatchService,
    private readonly tournamentService: TournamentService,
  ) {
    this.activities$ = combineLatest([
      this.matchService.getAll(),
      this.tournamentService.getAll(),
    ]).pipe(
      map(([matches, tournaments]) =>
        this.buildActivities(matches, tournaments),
      ),
      shareReplay({
        bufferSize: 1,
        refCount: true,
      }),
    );
  }

  private buildActivities(
    matches: Match[],
    tournaments: Tournament[],
  ): ActivityItem[] {
    const matchActivities = matches.map((match) =>
      this.createMatchActivity(match),
    );

    const tournamentActivities = tournaments.map((tournament) =>
      this.createTournamentActivity(tournament),
    );

    return [...matchActivities, ...tournamentActivities]
      .sort((a, b) => this.getTimeValue(b) - this.getTimeValue(a))
      .slice(0, 8);
  }

  private createMatchActivity(match: Match): ActivityItem {
    const displayStatus = this.getDisplayStatus(match);
    const title = this.getMatchTitle(match, displayStatus);
    const subtitle = `${match.tournament.name} • ${match.tournament.game.name}`;

    return {
      id: `match-${match.id}`,
      type: this.getMatchActivityType(displayStatus),
      title,
      subtitle,
      timestamp: match.scheduledAt ?? null,
      statusLabel: displayStatus,
      icon: this.getMatchIcon(displayStatus),
      link: '/matches',
    };
  }

  private createTournamentActivity(tournament: Tournament): ActivityItem {
    const status = tournament.status ?? 'OPEN';

    return {
      id: `tournament-${tournament.id}`,
      type: this.getTournamentActivityType(status),
      title: `${tournament.name} is ${status.toLowerCase()}`,
      subtitle: `${tournament.game.name} • ${tournament.maxTeams} teams`,
      timestamp: tournament.startDate ?? null,
      statusLabel: status,
      icon: this.getTournamentIcon(status),
      link: `/tournaments/${tournament.id}`,
    };
  }

  private getMatchTitle(match: Match, displayStatus: string): string {
    if (displayStatus === 'FINISHED' && match.winner) {
      return `${match.winner.name} defeated ${this.getLoserName(match)}`;
    }

    if (displayStatus === 'FINISHED') {
      return `${match.teamA.name} vs ${match.teamB.name} finished`;
    }

    if (displayStatus === 'LIVE') {
      return `${match.teamA.name} vs ${match.teamB.name} is live`;
    }

    if (displayStatus === 'CANCELLED') {
      return `${match.teamA.name} vs ${match.teamB.name} was cancelled`;
    }

    return `${match.teamA.name} vs ${match.teamB.name} is scheduled`;
  }

  private getLoserName(match: Match): string {
    if (!match.winner) {
      return 'opponent';
    }

    if (match.winner.id === match.teamA.id) {
      return match.teamB.name;
    }

    return match.teamA.name;
  }

  private getDisplayStatus(match: Match): string {
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

  private getMatchActivityType(status: string): ActivityItem['type'] {
    if (status === 'FINISHED') {
      return 'MATCH_FINISHED';
    }

    if (status === 'LIVE') {
      return 'MATCH_LIVE';
    }

    if (status === 'CANCELLED') {
      return 'MATCH_CANCELLED';
    }

    return 'MATCH_SCHEDULED';
  }

  private getTournamentActivityType(status: string): ActivityItem['type'] {
    if (status === 'FINISHED') {
      return 'TOURNAMENT_FINISHED';
    }

    if (status === 'ONGOING') {
      return 'TOURNAMENT_ONGOING';
    }

    if (status === 'CANCELLED') {
      return 'TOURNAMENT_CANCELLED';
    }

    return 'TOURNAMENT_OPEN';
  }

  private getMatchIcon(status: string): string {
    if (status === 'FINISHED') {
      return '🏆';
    }

    if (status === 'LIVE') {
      return '🔴';
    }

    if (status === 'CANCELLED') {
      return '⚠️';
    }

    return '🕒';
  }

  private getTournamentIcon(status: string): string {
    if (status === 'FINISHED') {
      return '🏁';
    }

    if (status === 'ONGOING') {
      return '⚡';
    }

    if (status === 'CANCELLED') {
      return '⛔';
    }

    return '🎮';
  }

  private getTimeValue(activity: ActivityItem): number {
    if (!activity.timestamp) {
      return 0;
    }

    const time = new Date(activity.timestamp).getTime();

    return Number.isNaN(time) ? 0 : time;
  }
}