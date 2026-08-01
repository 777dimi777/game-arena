import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, shareReplay, switchMap } from 'rxjs';

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
  profile$: Observable<TeamProfile>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly teamService: TeamService,
  ) {
    this.profile$ = this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((id) => this.teamService.getProfile(id)),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  getMatchResult(match: Match): string {
    const hasScores =
      match.scoreA !== null && match.scoreA !== undefined &&
      match.scoreB !== null && match.scoreB !== undefined;
    return hasScores ? `${match.scoreA} : ${match.scoreB}` : '- : -';
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
    const hasResult = match.scoreA !== null && match.scoreA !== undefined &&
      match.scoreB !== null && match.scoreB !== undefined &&
      (match.scoreA > 0 || match.scoreB > 0);
    return match.winner || hasResult ? 'FINISHED' : match.status;
  }
}
