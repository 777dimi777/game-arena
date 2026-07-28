import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  Subject,
} from 'rxjs';
import { Store } from '@ngrx/store';

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
  private readonly statusSubject = new BehaviorSubject<string>('ALL');
  statusFilters = [
    { label: 'All', value: 'ALL' },
    { label: 'Open', value: 'OPEN' },
    { label: 'Ongoing', value: 'ONGOING' },
    { label: 'Finished', value: 'FINISHED' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  selectedStatus = 'ALL';
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
      this.statusSubject,
    ]).pipe(
      map(([tournaments, search, status]) => {
        return tournaments.filter((tournament) => {
          const matchesSearch =
            tournament.name.toLowerCase().includes(search) ||
            tournament.description?.toLowerCase().includes(search) ||
            tournament.game?.name.toLowerCase().includes(search);

          const matchesStatus = status === 'ALL' || tournament.status === status;

          return matchesSearch && matchesStatus;
        });
      }),
    );
  }
  setStatusFilter(status: string): void {
    this.selectedStatus = status;
    this.statusSubject.next(status);
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
