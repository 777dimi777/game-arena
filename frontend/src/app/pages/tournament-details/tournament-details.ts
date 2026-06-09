import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, finalize, switchMap } from 'rxjs';

import { Team } from '../../models/team';
import { Tournament } from '../../models/tournament';
import { TeamService } from '../../services/team';
import { TournamentService } from '../../services/tournament';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-tournament-details',
  standalone: false,
  templateUrl: './tournament-details.html',
  styleUrl: './tournament-details.scss',
})
export class TournamentDetails implements OnInit {
  tournament$!: Observable<Tournament>;

  tournamentId = 0;
  selectedTeamId = 0;

  teams: Team[] = [];

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly tournamentService: TournamentService,
    private readonly teamService: TeamService,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.tournament$ = this.route.paramMap.pipe(
      switchMap((params) => {
        this.tournamentId = Number(params.get('id'));

        return this.tournamentService.getById(this.tournamentId);
      }),
    );

    this.teamService.getAll().subscribe({
      next: (teams) => {
        this.teams = teams;

        if (teams.length > 0) {
          this.selectedTeamId = teams[0].id;
        }
      },
      error: () => {
        this.errorMessage = 'Failed to load teams.';
      },
    });
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
          this.successMessage = 'Team joined the tournament successfully.';

          this.tournament$ =
            this.tournamentService.getById(this.tournamentId);
        },
        error: (error) => {
          const message = error.error?.message;

          this.errorMessage = Array.isArray(message)
            ? message.join(', ')
            : message ?? 'Failed to join tournament.';
        },
      });
  }
}