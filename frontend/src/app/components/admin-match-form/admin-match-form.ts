import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { finalize, forkJoin } from 'rxjs';

import { Match } from '../../models/match';
import { Team } from '../../models/team';
import { Tournament } from '../../models/tournament';
import { MatchService } from '../../services/match';
import { TeamService } from '../../services/team';
import { TournamentService } from '../../services/tournament';

@Component({
  selector: 'app-admin-match-form',
  standalone: false,
  templateUrl: './admin-match-form.html',
  styleUrl: './admin-match-form.scss',
})
export class AdminMatchForm implements OnInit {
  scheduledAt = '';
  tournamentId = 0;
  teamAId = 0;
  teamBId = 0;

  tournaments: Tournament[] = [];
  teams: Team[] = [];

  loading = false;
  errorMessage = '';
  successMessage = '';

  @Output()
  matchCreated = new EventEmitter<Match>();

  constructor(
    private readonly matchService: MatchService,
    private readonly tournamentService: TournamentService,
    private readonly teamService: TeamService,
  ) {}

  ngOnInit(): void {
    forkJoin({
      tournaments: this.tournamentService.getAll(),
      teams: this.teamService.getAll(),
    }).subscribe({
      next: ({ tournaments, teams }) => {
        this.tournaments = tournaments;
        this.teams = teams;

        if (tournaments.length > 0) {
          this.tournamentId = tournaments[0].id;
        }

        if (teams.length > 0) {
          this.teamAId = teams[0].id;
        }

        if (teams.length > 1) {
          this.teamBId = teams[1].id;
        } else if (teams.length === 1) {
          this.teamBId = teams[0].id;
        }
      },
      error: () => {
        this.errorMessage = 'Failed to load tournaments or teams.';
      },
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      this.tournamentId === 0 ||
      this.teamAId === 0 ||
      this.teamBId === 0
    ) {
      this.errorMessage = 'Please select a tournament and both teams.';
      return;
    }

    if (this.teamAId === this.teamBId) {
      this.errorMessage = 'Team A and Team B must be different.';
      return;
    }

    this.loading = true;

    this.matchService
      .create({
        scheduledAt: this.scheduledAt,
        tournamentId: Number(this.tournamentId),
        teamAId: Number(this.teamAId),
        teamBId: Number(this.teamBId),
      })
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: (match) => {
          this.successMessage = 'Match created successfully.';
          this.matchCreated.emit(match);
          this.scheduledAt = '';
        },
        error: (error) => {
          const message = error.error?.message;

          this.errorMessage = Array.isArray(message)
            ? message.join(', ')
            : (message ?? 'Failed to create match.');
        },
      });
  }
}