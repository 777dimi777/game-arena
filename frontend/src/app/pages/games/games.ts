import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { catchError, finalize, Observable, of, shareReplay } from 'rxjs';

import { Game } from '../../models/game';
import { GameService } from '../../services/game';

@Component({ selector: 'app-games', standalone: false, templateUrl: './games.html', styleUrl: './games.scss' })
export class Games {
  loading = true;
  errorMessage = '';
  games$: Observable<Game[]>;

  constructor(private readonly gameService: GameService) {
    this.games$ = this.gameService.getAll().pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message ?? 'Failed to load games.';
        return of([]);
      }),
      finalize(() => { this.loading = false; }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  trackById(_index: number, game: Game): number { return game.id; }
}
