import { Component, inject } from '@angular/core';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private readonly authService = inject(AuthService);

  user = this.authService.getCurrentUser();

  isAdmin(): boolean {
    return this.user?.role === 'ADMIN';
  }
}