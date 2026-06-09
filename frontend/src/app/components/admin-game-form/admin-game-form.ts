import { Component, EventEmitter, Output } from '@angular/core';

import { Game } from '../../models/game';
import { GameService } from '../../services/game';

@Component({
  selector: 'app-admin-game-form',
  standalone: false,
  templateUrl: './admin-game-form.html',
  styleUrl: './admin-game-form.scss',
})
export class AdminGameForm {
  name = '';
  genre = '';
  teamSize = 1;
  imageUrl = '';

  loading = false;
  errorMessage = '';
  successMessage = '';

  @Output()
  gameCreated = new EventEmitter<Game>();

  constructor(private readonly gameService: GameService) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    this.gameService
      .create({
        name: this.name,
        genre: this.genre,
        teamSize: this.teamSize,
        imageUrl: this.imageUrl || undefined,
      })
      .subscribe({
        next: (game) => {
          this.loading = false;
          this.successMessage = 'Game created successfully.';

          this.gameCreated.emit(game);

          this.name = '';
          this.genre = '';
          this.teamSize = 1;
          this.imageUrl = '';
        },
        error: (error) => {
          this.loading = false;

          const message = error.error?.message;

          this.errorMessage = Array.isArray(message)
            ? message.join(', ')
            : message ?? 'Failed to create game.';
        },
      });
  }
}