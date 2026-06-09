import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { finalize } from 'rxjs';

import { Game } from '../../models/game';
import { Tournament } from '../../models/tournament';
import { GameService } from '../../services/game';
import { TournamentService } from '../../services/tournament';

@Component({
  selector: 'app-admin-tournament-form',
  standalone: false,
  templateUrl: './admin-tournament-form.html',
  styleUrl: './admin-tournament-form.scss',
})
export class AdminTournamentForm implements OnInit {
  name = '';
  description = '';
  startDate = '';
  maxTeams = 2;
  prizePool = 0;
  status = 'OPEN';
  gameId = 0;

  games: Game[] = [];

  loading = false;
  errorMessage = '';
  successMessage = '';

  @Output()
  tournamentCreated = new EventEmitter<Tournament>();

  constructor(
    private readonly tournamentService: TournamentService,
    private readonly gameService: GameService,
  ) {}

  ngOnInit(): void {
    this.gameService.getAll().subscribe({
      next: (games) => {
        this.games = games;

        if (games.length > 0) {
          this.gameId = games[0].id;
        }
      },
      error: () => {
        this.errorMessage = 'Failed to load games.';
      },
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.gameId === 0) {
      this.errorMessage = 'Please select a game.';
      return;
    }

    this.loading = true;

    this.tournamentService
      .create({
        name: this.name,
        description: this.description,
        startDate: this.startDate,
        maxTeams: Number(this.maxTeams),
        prizePool: Number(this.prizePool),
        status: this.status,
        gameId: Number(this.gameId),
      })
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: (tournament) => {
          this.successMessage = 'Tournament created successfully.';
          this.tournamentCreated.emit(tournament);

          this.name = '';
          this.description = '';
          this.startDate = '';
          this.maxTeams = 2;
          this.prizePool = 0;
          this.status = 'OPEN';

          if (this.games.length > 0) {
            this.gameId = this.games[0].id;
          }
        },
        error: (error) => {
          const message = error.error?.message;

          this.errorMessage = Array.isArray(message)
            ? message.join(', ')
            : message ?? 'Failed to create tournament.';
        },
      });
  }
}