import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  finalize,
  map,
  Observable,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';

import { LeaderboardItem } from '../../models/leaderboard-item';
import { Team } from '../../models/team';
import { Tournament } from '../../models/tournament';
import { AuthService } from '../../services/auth';
import { TeamService } from '../../services/team';
import { TournamentService } from '../../services/tournament';

@Component({
  selector: 'app-tournament-details',
  standalone: false,
  templateUrl: './tournament-details.html',
  styleUrl: './tournament-details.scss',
})
export class TournamentDetails implements OnInit {
  tournament$!: Observable<Tournament>;
  leaderboard$!: Observable<LeaderboardItem[]>;
  teams$!: Observable<Team[]>;

  tournamentId = 0;
  selectedTeamId = 0;

  loading = false;
  errorMessage = '';
  successMessage = '';

  private readonly refreshSubject = new BehaviorSubject<void>(undefined);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly tournamentService: TournamentService,
    private readonly teamService: TeamService,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    const tournamentId$ = this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      tap((id) => {
        this.tournamentId = id;
      }),
      shareReplay({
        bufferSize: 1,
        refCount: true,
      }),
    );

    this.tournament$ = combineLatest([
      tournamentId$,
      this.refreshSubject,
    ]).pipe(
      switchMap(([id]) => this.tournamentService.getById(id)),
      shareReplay({
        bufferSize: 1,
        refCount: true,
      }),
    );

    this.leaderboard$ = combineLatest([
      tournamentId$,
      this.refreshSubject,
    ]).pipe(
      switchMap(([id]) => this.tournamentService.getLeaderboard(id)),
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

    this.loading = true;

    this.tournamentService
      .joinTournament(this.tournamentId, this.selectedTeamId)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: () => {
          this.successMessage =
            'Team joined the tournament successfully.';

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