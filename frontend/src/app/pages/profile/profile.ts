import { Component } from '@angular/core';

import { AuthService, CurrentUser } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  user: CurrentUser | null;

  constructor(private readonly authService: AuthService) {
    this.user = this.authService.getCurrentUser();
  }
}