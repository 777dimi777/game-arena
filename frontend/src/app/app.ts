import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
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

  isAdmin(): boolean {
    return this.authService.getCurrentUser()?.role === 'ADMIN';
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}