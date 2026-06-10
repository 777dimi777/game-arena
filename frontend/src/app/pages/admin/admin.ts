import { Component } from '@angular/core';
import { Match } from '../../models/match';
import { Game } from '../../models/game';
import { Tournament } from '../../models/tournament';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  lastCreatedGame?: Game;
  lastCreatedTournament?: Tournament;
  lastCreatedMatch?: Match;
  lastUpdatedMatch?: Match;

  onMatchCreated(match: Match): void {
    this.lastCreatedMatch = match;
  }
  onGameCreated(game: Game): void {
    this.lastCreatedGame = game;
  }

  onTournamentCreated(tournament: Tournament): void {
    this.lastCreatedTournament = tournament;
  }

  onResultUpdated(match: Match): void {
    this.lastUpdatedMatch = match;
  }
}
