import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { Game } from '../../models/game';
import { GameService } from '../../services/game';

@Component({
  selector: 'app-games',
  standalone: false,
  templateUrl: './games.html',
  styleUrl: './games.scss',
})
export class Games {
  games$: Observable<Game[]>;

  constructor(private readonly gameService: GameService) {
    this.games$ = this.gameService.getAll();
  }
}