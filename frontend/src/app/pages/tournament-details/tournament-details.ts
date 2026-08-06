import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, finalize, Observable, shareReplay, switchMap, tap } from 'rxjs';

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
import { Match } from '../../models/match';
import { MatchService } from '../../services/match';
@Component({
  selector: 'app-tournament-details',
  standalone: false,
  templateUrl: './tournament-details.html',
  styleUrl: './tournament-details.scss',
})
export class TournamentDetails implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  tournament$!: Observable<Tournament | null>;
  leaderboard$!: Observable<LeaderboardItem[]>;
  teams$!: Observable<Team[]>;

  loading$!: Observable<boolean>;
  storeError$!: Observable<string | null>;
  matchHistory$!: Observable<Match[]>;

  tournamentId = 0;
  selectedTeamId = 0;

  joinLoading = false;
  errorMessage = '';
  successMessage = '';

  private readonly refreshSubject = new BehaviorSubject<void>(undefined);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store,
    private readonly tournamentService: TournamentService,
    private readonly teamService: TeamService,
    private readonly matchService: MatchService,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.tournament$ = this.store.select(selectSelectedTournament);
    this.loading$ = this.store.select(selectTournamentLoading);
    this.storeError$ = this.store.select(selectTournamentError);

    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
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
    this.matchHistory$ = this.refreshSubject.pipe(
      switchMap(() => this.matchService.getByTournament(this.tournamentId)),
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
  getBracketRoundLabel(index: number): string {
    return `Match ${index + 1}`;
  }
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  getBracketWinnerName(match: Match): string {
    if (match.winner) {
      return match.winner.name;
    }

    if (this.getDisplayStatus(match) === 'FINISHED') {
      return 'Draw / No winner';
    }

    return 'Winner pending';
  }
  getBracketCardClass(match: Match): string {
    const status = this.getDisplayStatus(match);

    if (status === 'FINISHED') {
      return 'finished';
    }

    if (status === 'LIVE') {
      return 'live';
    }

    if (status === 'CANCELLED') {
      return 'cancelled';
    }

    return 'scheduled';
  }
  isTeamWinner(match: Match, teamId: number): boolean {
    return match.winner?.id === teamId;
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
  getDisplayStatus(match: Match): string {
    if (match.status === 'CANCELLED') return 'CANCELLED';
    if (match.status === 'FINISHED') return 'FINISHED';
    if (match.winner || (match.scoreA ?? 0) > 0 || (match.scoreB ?? 0) > 0) {
      return 'FINISHED';
    }
    return match.status;
  }
  getMatchResult(match: Match): string {
    const hasScores =
      match.scoreA !== null &&
      match.scoreA !== undefined &&
      match.scoreB !== null &&
      match.scoreB !== undefined;

    if (!hasScores) {
      return '- : -';
    }

    return `${match.scoreA} : ${match.scoreB}`;
  }
  isFinished(match: Match): boolean {
    return this.getDisplayStatus(match) === 'FINISHED';
  }
}
