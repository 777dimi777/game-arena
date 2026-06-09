import { Component } from '@angular/core';

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

  onGameCreated(game: Game): void {
    this.lastCreatedGame = game;
  }

  onTournamentCreated(tournament: Tournament): void {
    this.lastCreatedTournament = tournament;
  }
}