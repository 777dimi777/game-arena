import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, CurrentUser } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getCurrentUser(): CurrentUser | null {
    return this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}