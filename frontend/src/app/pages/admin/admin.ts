import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Game } from '../../models/game';
import { Match } from '../../models/match';
import { Tournament } from '../../models/tournament';

import { TournamentActions } from '../../store/tournament/tournament.actions';
import {
  selectAllTournaments,
  selectTournamentError,
  selectTournamentLoading,
} from '../../store/tournament/tournament.selectors';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit {
  tournaments$: Observable<Tournament[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  lastCreatedGame?: Game;
  lastCreatedTournament?: Tournament;
  lastCreatedMatch?: Match;
  lastUpdatedMatch?: Match;

  constructor(private readonly store: Store) {
    this.tournaments$ = this.store.select(selectAllTournaments);
    this.loading$ = this.store.select(selectTournamentLoading);
    this.error$ = this.store.select(selectTournamentError);
  }

  ngOnInit(): void {
    this.store.dispatch(TournamentActions.loadTournaments());
  }

  deleteTournament(id: number): void {
    const confirmed = confirm(
      'Are you sure you want to delete this tournament?',
    );

    if (!confirmed) {
      return;
    }

    this.store.dispatch(
      TournamentActions.deleteTournament({
        id,
      }),
    );
  }

  onGameCreated(game: Game): void {
    this.lastCreatedGame = game;
  }

  onTournamentCreated(tournament: Tournament): void {
    this.lastCreatedTournament = tournament;
  }

  onMatchCreated(match: Match): void {
    this.lastCreatedMatch = match;
  }

  onResultUpdated(match: Match): void {
    this.lastUpdatedMatch = match;
  }
}