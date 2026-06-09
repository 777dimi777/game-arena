import { Component } from '@angular/core';

import { Game } from '../../models/game';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  lastCreatedGame?: Game;

  onGameCreated(game: Game): void {
    this.lastCreatedGame = game;
  }
}