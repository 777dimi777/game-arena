import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Tournament } from '../../models/tournament';
import { TournamentActions } from '../../store/tournament/tournament.actions';
import {
  selectAllTournaments,
  selectTournamentError,
  selectTournamentLoading,
} from '../../store/tournament/tournament.selectors';

@Component({
  selector: 'app-tournaments',
  standalone: false,
  templateUrl: './tournaments.html',
  styleUrl: './tournaments.scss',
})
export class Tournaments implements OnInit {
  tournaments$: Observable<Tournament[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
  ) {
    this.tournaments$ = this.store.select(selectAllTournaments);
    this.loading$ = this.store.select(selectTournamentLoading);
    this.error$ = this.store.select(selectTournamentError);
  }

 ngOnInit(): void {
  this.store.dispatch(TournamentActions.loadTournaments());
}

  goToTournament(id: number): void {
    this.router.navigate(['/tournaments', id]);
  }
}