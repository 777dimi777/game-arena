import { Component, inject } from '@angular/core';
import { combineLatest, map, Observable, shareReplay } from 'rxjs';

import { Match } from '../../models/match';
import { Team } from '../../models/team';
import { Tournament } from '../../models/tournament';
import { AuthService } from '../../services/auth';
import { MatchService } from '../../services/match';
import { TeamService } from '../../services/team';
import { TournamentService } from '../../services/tournament';

interface ProfileStats {
  teamsCount: number;
  tournamentsCount: number;
  finishedMatchesCount: number;
  winsCount: number;
}

interface UserReference {
  id: number;
}

interface TeamOwnership {
  owner?: UserReference | null;
  user?: UserReference | null;
  createdBy?: UserReference | null;
  ownerId?: number | null;
  userId?: number | null;
}

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private readonly authService = inject(AuthService);
  private readonly teamService = inject(TeamService);
  private readonly tournamentService = inject(TournamentService);
  private readonly matchService = inject(MatchService);

  readonly user = this.authService.getCurrentUser();

  private readonly teams$ = this.teamService.getAll().pipe(
    shareReplay({ bufferSize: 1, refCount: true }),
  );
  private readonly tournaments$ = this.tournamentService.getAll().pipe(
    shareReplay({ bufferSize: 1, refCount: true }),
  );
  private readonly matches$ = this.matchService.getAll().pipe(
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly myTeams$: Observable<Team[]> = this.teams$.pipe(
    map((teams) =>
      this.user
        ? teams.filter((team) => this.getTeamOwnerId(team) === this.user?.id)
        : [],
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly myTournaments$: Observable<Tournament[]> = combineLatest([
    this.tournaments$,
    this.myTeams$,
  ]).pipe(
    map(([tournaments, myTeams]) => {
      const myTeamIds = new Set(myTeams.map((team) => team.id));
      return tournaments.filter((tournament) =>
        tournament.teams?.some((team) => myTeamIds.has(team.id)),
      );
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly myMatches$: Observable<Match[]> = combineLatest([
    this.matches$,
    this.myTeams$,
  ]).pipe(
    map(([matches, myTeams]) => {
      const myTeamIds = new Set(myTeams.map((team) => team.id));
      return matches.filter(
        (match) =>
          myTeamIds.has(match.teamA.id) || myTeamIds.has(match.teamB.id),
      );
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly profileStats$: Observable<ProfileStats> = combineLatest([
    this.myTeams$,
    this.myTournaments$,
    this.myMatches$,
  ]).pipe(
    map(([teams, tournaments, matches]) => {
      const myTeamIds = new Set(teams.map((team) => team.id));

      return {
        teamsCount: teams.length,
        tournamentsCount: tournaments.length,
        finishedMatchesCount: matches.filter((match) =>
          this.isFinishedMatch(match),
        ).length,
        winsCount: matches.filter(
          (match) => match.winner && myTeamIds.has(match.winner.id),
        ).length,
      };
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  isAdmin(): boolean {
    return this.user?.role === 'ADMIN';
  }

  private getTeamOwnerId(team: Team): number | null {
    const ownership = team as Team & TeamOwnership;
    return (
      ownership.owner?.id ??
      ownership.user?.id ??
      ownership.createdBy?.id ??
      ownership.ownerId ??
      ownership.userId ??
      null
    );
  }

  private isFinishedMatch(match: Match): boolean {
    if (match.status === 'CANCELLED') return false;
    const hasResult =
      match.scoreA !== null &&
      match.scoreA !== undefined &&
      match.scoreB !== null &&
      match.scoreB !== undefined &&
      (match.scoreA > 0 || match.scoreB > 0);

    return match.status === 'FINISHED' || Boolean(match.winner) || hasResult;
  }
}
