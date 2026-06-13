import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  finalize,
  Observable,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';

import { Store } from '@ngrx/store';

import { LeaderboardItem } from '../../models/leaderboard-item';
import { Team } from '../../models/team';
import { Tournament } from '../../models/tournament';
import { AuthService } from '../../services/auth';
import { TeamService } from '../../services/team';
import { TournamentService } from '../../services/tournament';

import { TournamentActions } from '../../store/tournament/tournament.actions';
import {
  selectSelectedTournament,
  selectTournamentError,
  selectTournamentLoading,
} from '../../store/tournament/tournament.selectors';

@Component({
  selector: 'app-tournament-details',
  standalone: false,
  templateUrl: './tournament-details.html',
  styleUrl: './tournament-details.scss',
})
export class TournamentDetails implements OnInit {
  tournament$!: Observable<Tournament | null>;
  leaderboard$!: Observable<LeaderboardItem[]>;
  teams$!: Observable<Team[]>;

  loading$!: Observable<boolean>;
  storeError$!: Observable<string | null>;

  tournamentId = 0;
  selectedTeamId = 0;

  joinLoading = false;
  errorMessage = '';
  successMessage = '';

  private readonly refreshSubject = new BehaviorSubject<void>(undefined);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly tournamentService: TournamentService,
    private readonly teamService: TeamService,
    private readonly authService: AuthService,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.tournament$ = this.store.select(selectSelectedTournament);
    this.loading$ = this.store.select(selectTournamentLoading);
    this.storeError$ = this.store.select(selectTournamentError);

    this.route.paramMap.subscribe((params) => {
      this.tournamentId = Number(params.get('id'));

      this.store.dispatch(
        TournamentActions.loadTournamentDetails({
          id: this.tournamentId,
        }),
      );

      this.refreshSubject.next();
    });

    this.leaderboard$ = this.refreshSubject.pipe(
      switchMap(() => this.tournamentService.getLeaderboard(this.tournamentId)),
      shareReplay({
        bufferSize: 1,
        refCount: true,
      }),
    );

    this.teams$ = this.teamService.getAll().pipe(
      tap((teams) => {
        if (teams.length > 0 && this.selectedTeamId === 0) {
          this.selectedTeamId = teams[0].id;
        }
      }),
      shareReplay({
        bufferSize: 1,
        refCount: true,
      }),
    );
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  joinTournament(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.isLoggedIn()) {
      this.errorMessage = 'You must be logged in to join a tournament.';
      return;
    }

    if (this.selectedTeamId === 0) {
      this.errorMessage = 'Please select a team.';
      return;
    }

    this.joinLoading = true;

    this.tournamentService
      .joinTournament(this.tournamentId, this.selectedTeamId)
      .pipe(
        finalize(() => {
          this.joinLoading = false;
        }),
      )
      .subscribe({
        next: () => {
          this.successMessage = 'Team joined the tournament successfully.';

          this.store.dispatch(
            TournamentActions.loadTournamentDetails({
              id: this.tournamentId,
            }),
          );

          this.refreshSubject.next();
        },
        error: (error) => {
          const message = error.error?.message;

          this.errorMessage = Array.isArray(message)
            ? message.join(', ')
            : (message ?? 'Failed to join tournament.');
        },
      });
  }
}
