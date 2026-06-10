import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { finalize } from 'rxjs';

import { Match } from '../../models/match';
import { MatchService } from '../../services/match';

@Component({
  selector: 'app-admin-match-result-form',
  standalone: false,
  templateUrl: './admin-match-result-form.html',
  styleUrl: './admin-match-result-form.scss',
})
export class AdminMatchResultForm implements OnInit {
  matches: Match[] = [];

  matchId = 0;
  scoreA = 0;
  scoreB = 0;

  loading = false;
  errorMessage = '';
  successMessage = '';

  @Output()
  resultUpdated = new EventEmitter<Match>();

  constructor(private readonly matchService: MatchService) {}

  ngOnInit(): void {
    this.loadMatches();
  }

  loadMatches(): void {
    this.matchService.getAll().subscribe({
      next: (matches) => {
        this.matches = matches;

        if (matches.length > 0) {
          this.matchId = matches[0].id;
        }
      },
      error: () => {
        this.errorMessage = 'Failed to load matches.';
      },
    });
  }

  getSelectedMatch(): Match | undefined {
    return this.matches.find((match) => match.id === this.matchId);
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.matchId === 0) {
      this.errorMessage = 'Please select a match.';
      return;
    }

    if (this.scoreA < 0 || this.scoreB < 0) {
      this.errorMessage = 'Scores cannot be negative.';
      return;
    }

    this.loading = true;

    this.matchService
      .updateResult(
        this.matchId,
        Number(this.scoreA),
        Number(this.scoreB),
      )
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: (match) => {
          this.successMessage = match.winner
            ? `Result saved. Winner: ${match.winner.name}`
            : 'Result saved. The match is tied.';

          this.resultUpdated.emit(match);
          this.loadMatches();
        },
        error: (error) => {
          const message = error.error?.message;

          this.errorMessage = Array.isArray(message)
            ? message.join(', ')
            : (message ?? 'Failed to update match result.');
        },
      });
  }
}