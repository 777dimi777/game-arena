import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { TeamService } from '../../services/team';

@Component({
  selector: 'app-create-team',
  standalone: false,
  templateUrl: './create-team.html',
  styleUrl: './create-team.scss',
})
export class CreateTeam {
  name = '';
  tag = '';
  logoUrl = '';
  description = '';

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly teamService: TeamService,
    private readonly router: Router,
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    this.teamService
      .create({
        name: this.name,
        tag: this.tag,
        logoUrl: this.logoUrl || undefined,
        description: this.description || undefined,
      })
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: () => {
          this.successMessage = 'Team created successfully.';

          setTimeout(() => {
            this.router.navigate(['/teams']);
          }, 1000);
        },
        error: (error) => {
          const message = error.error?.message;

          this.errorMessage = Array.isArray(message)
            ? message.join(', ')
            : message ?? 'Failed to create team.';
        },
      });
  }
}