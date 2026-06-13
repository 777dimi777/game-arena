import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { Game } from '../../models/game';
import { GameService } from '../../services/game';
import { TournamentActions } from '../../store/tournament/tournament.actions';
import {
  selectTournamentError,
  selectTournamentLoading,
} from '../../store/tournament/tournament.selectors';

@Component({
  selector: 'app-admin-tournament-form',
  standalone: false,
  templateUrl: './admin-tournament-form.html',
  styleUrl: './admin-tournament-form.scss',
})
export class AdminTournamentForm implements OnInit {
  private readonly store = inject(Store);
  private readonly gameService = inject(GameService);

  name = '';
  description = '';
  startDate = '';
  maxTeams = 8;
  prizePool = 0;
  status = 'OPEN';
  gameId = 0;

  games: Game[] = [];

  loading$ = this.store.select(selectTournamentLoading);
  error$ = this.store.select(selectTournamentError);

  successMessage = '';

  ngOnInit(): void {
    this.gameService.getAll().subscribe({
      next: (games) => {
        this.games = games;

        if (games.length > 0) {
          this.gameId = games[0].id;
        }
      },
      error: () => {
        this.successMessage = '';
      },
    });
  }

  onSubmit(): void {
    this.successMessage = '';

    if (this.gameId === 0) {
      return;
    }

    this.store.dispatch(
      TournamentActions.createTournament({
        tournament: {
          name: this.name,
          description: this.description,
          startDate: this.startDate,
          maxTeams: Number(this.maxTeams),
          prizePool: Number(this.prizePool),
          status: this.status,
          gameId: Number(this.gameId),
        },
      }),
    );

    this.successMessage =
      'Tournament creation request has been sent.';

    this.name = '';
    this.description = '';
    this.startDate = '';
    this.maxTeams = 8;
    this.prizePool = 0;
    this.status = 'OPEN';
  }
}