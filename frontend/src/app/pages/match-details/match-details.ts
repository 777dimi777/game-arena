import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, shareReplay, switchMap } from 'rxjs';

import { Match } from '../../models/match';
import { MatchService } from '../../services/match';

@Component({
  selector: 'app-match-details',
  standalone: false,
  templateUrl: './match-details.html',
  styleUrl: './match-details.scss',
})
export class MatchDetails {
  match$: Observable<Match>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly matchService: MatchService,
  ) {
    this.match$ = this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((id) => this.matchService.getById(id)),
      shareReplay({
        bufferSize: 1,
        refCount: true,
      }),
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

  getMatchResult(match: Match): string {
    const hasScores =
      match.scoreA !== null &&
      match.scoreA !== undefined &&
      match.scoreB !== null &&
      match.scoreB !== undefined;

    if (!hasScores) {
      return '- : -';
    }

    return `${match.scoreA} : ${match.scoreB}`;
  }

  isTeamWinner(match: Match, teamId: number): boolean {
    return match.winner?.id === teamId;
  }

  getWinnerText(match: Match): string {
    if (match.winner) {
      return match.winner.name;
    }

    if (this.getDisplayStatus(match) === 'FINISHED') {
      return 'Draw / No winner';
    }

    return 'Winner pending';
  }

  getRoomTitle(match: Match): string {
    const status = this.getDisplayStatus(match);

    if (status === 'LIVE') {
      return 'Live match room';
    }

    if (status === 'FINISHED') {
      return 'Match summary';
    }

    if (status === 'CANCELLED') {
      return 'Cancelled match';
    }

    return 'Upcoming match';
  }
}