import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  private enabled = localStorage.getItem('gameArenaSound') === 'true';
  private audioContext?: AudioContext;

  isEnabled(): boolean {
    return this.enabled;
  }

  toggle(): void {
    this.enabled = !this.enabled;

    localStorage.setItem(
      'gameArenaSound',
      String(this.enabled),
    );

    if (this.enabled) {
      this.playTone(620, 0.07);
    }
  }

  click(): void {
    if (!this.enabled) {
      return;
    }

    this.playTone(360, 0.04);
  }

  private playTone(frequency: number, duration: number): void {
    const AudioContextConstructor =
      window.AudioContext ||
      (
        window as unknown as {
          webkitAudioContext?: typeof AudioContext;
        }
      ).webkitAudioContext;

    if (!AudioContextConstructor) {
      return;
    }

    if (!this.audioContext) {
      this.audioContext = new AudioContextConstructor();
    }

    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(
      frequency,
      this.audioContext.currentTime,
    );

    gain.gain.setValueAtTime(
      0.0001,
      this.audioContext.currentTime,
    );

    gain.gain.exponentialRampToValueAtTime(
      0.06,
      this.audioContext.currentTime + 0.01,
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      this.audioContext.currentTime + duration,
    );

    oscillator.connect(gain);
    gain.connect(this.audioContext.destination);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }
}