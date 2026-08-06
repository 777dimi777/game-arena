import { Component, DestroyRef, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { Game } from '../../models/game';
import { Tournament } from '../../models/tournament';
import { GameService } from '../../services/game';
import { TournamentActions } from '../../store/tournament/tournament.actions';
import { selectTournamentError, selectTournamentLoading } from '../../store/tournament/tournament.selectors';

@Component({
  selector: 'app-admin-tournament-form',
  standalone: false,
  templateUrl: './admin-tournament-form.html',
  styleUrl: './admin-tournament-form.scss',
})
export class AdminTournamentForm implements OnInit {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly gameService = inject(GameService);
  private readonly destroyRef = inject(DestroyRef);

  @Output() tournamentCreated = new EventEmitter<Tournament>();

  name = '';
  description = '';
  startDate = '';
  maxTeams = 8;
  prizePool = 0;
  status = 'OPEN';
  gameId = 0;
  games: Game[] = [];
  gamesLoading = true;
  gamesError = '';

  loading$ = this.store.select(selectTournamentLoading);
  error$ = this.store.select(selectTournamentError);
  successMessage = '';

  ngOnInit(): void {
    this.gameService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (games) => {
        this.games = games;
        this.gamesLoading = false;
        if (games.length > 0) this.gameId = games[0].id;
      },
      error: () => {
        this.gamesLoading = false;
        this.gamesError = 'Failed to load games.';
      },
    });

    this.actions$.pipe(
      ofType(TournamentActions.createTournamentSuccess),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(({ tournament }) => {
      this.successMessage = 'Tournament created successfully.';
      this.tournamentCreated.emit(tournament);
      this.resetForm();
    });
  }

  onSubmit(): void {
    this.successMessage = '';
    if (this.gameId === 0) {
      this.gamesError = 'Please select a game.';
      return;
    }

    this.store.dispatch(TournamentActions.createTournament({
      tournament: {
        name: this.name,
        description: this.description,
        startDate: this.startDate,
        maxTeams: Number(this.maxTeams),
        prizePool: Number(this.prizePool),
        status: this.status,
        gameId: Number(this.gameId),
      },
    }));
  }

  private resetForm(): void {
    this.name = '';
    this.description = '';
    this.startDate = '';
    this.maxTeams = 8;
    this.prizePool = 0;
    this.status = 'OPEN';
  }
}
