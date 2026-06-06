import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tournament } from '../../models/tournament';

@Component({
  selector: 'app-tournament-card',
  standalone: false,
  templateUrl: './tournament-card.html',
  styleUrl: './tournament-card.scss',
})
export class TournamentCard {
  @Input()
  tournament!: Tournament;

  @Output()
  selected = new EventEmitter<number>();

  onViewDetails(): void {
    console.log('Button clicked:', this.tournament.id);
    this.selected.emit(this.tournament.id);
  }
}