import {
  Component,
  HostListener,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './services/auth';
import { SoundService } from './services/sound';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss',
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly soundService = inject(SoundService);
  private readonly router = inject(Router);

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.authService.getCurrentUser()?.role === 'ADMIN';
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  soundEnabled(): boolean {
    return this.soundService.isEnabled();
  }

  toggleSound(): void {
    this.soundService.toggle();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;

    if (!target) {
      return;
    }

    const interactiveElement = target.closest(
      'button, a, select',
    );

    if (
      interactiveElement &&
      !interactiveElement.classList.contains('sound-toggle')
    ) {
      this.soundService.click();
    }
  }
}