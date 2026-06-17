import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  Observable,
  Subject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
} from 'rxjs';

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
  filteredTournaments$: Observable<Tournament[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  private readonly searchSubject = new Subject<string>();

  constructor(
    private readonly store: Store,
    private readonly router: Router,
  ) {
    this.tournaments$ = this.store.select(selectAllTournaments);
    this.loading$ = this.store.select(selectTournamentLoading);
    this.error$ = this.store.select(selectTournamentError);

    const search$ = this.searchSubject.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map((value) => value.toLowerCase().trim()),
    );

    this.filteredTournaments$ = combineLatest([
      this.tournaments$,
      search$,
    ]).pipe(
      map(([tournaments, search]) => {
        if (!search) {
          return tournaments;
        }

        return tournaments.filter((tournament) => {
          const name = tournament.name.toLowerCase();
          const description = tournament.description.toLowerCase();
          const game = tournament.game.name.toLowerCase();
          const status = tournament.status.toLowerCase();

          return (
            name.includes(search) ||
            description.includes(search) ||
            game.includes(search) ||
            status.includes(search)
          );
        });
      }),
    );
  }

  ngOnInit(): void {
    this.store.dispatch(TournamentActions.loadTournaments());
  }

  onSearch(value: string): void {
    this.searchSubject.next(value);
  }

  goToTournament(id: number): void {
    this.router.navigate(['/tournaments', id]);
  }
}