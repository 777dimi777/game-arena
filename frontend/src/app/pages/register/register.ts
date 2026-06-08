import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.loading = true;

    this.authService
      .register(this.username, this.email, this.password)
      .subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'Registration successful. Redirecting...';

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1200);
        },
        error: (error) => {
          this.loading = false;

          const message = error.error?.message;

          this.errorMessage = Array.isArray(message)
            ? message.join(', ')
            : message ?? 'Registration failed.';
        },
      });
  }
}