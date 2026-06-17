import { Component } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';

import { GameService } from '../../services/game';
import { MatchService } from '../../services/match';
import { TeamService } from '../../services/team';
import { TournamentService } from '../../services/tournament';

interface HomeStats {
  tournamentsCount: number;
  gamesCount: number;
  teamsCount: number;
  matchesCount: number;
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  stats$: Observable<HomeStats>;

  constructor(
    private readonly tournamentService: TournamentService,
    private readonly gameService: GameService,
    private readonly teamService: TeamService,
    private readonly matchService: MatchService,
  ) {
    this.stats$ = forkJoin({
      tournaments: this.tournamentService.getAll(),
      games: this.gameService.getAll(),
      teams: this.teamService.getAll(),
      matches: this.matchService.getAll(),
    }).pipe(
      map(({ tournaments, games, teams, matches }) => ({
        tournamentsCount: tournaments.length,
        gamesCount: games.length,
        teamsCount: teams.length,
        matchesCount: matches.length,
      })),
    );
  }
}