import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Tournament } from '../../models/tournament';
import { TournamentService } from '../../services/tournament';

@Component({
  selector: 'app-tournaments',
  standalone: false,
  templateUrl: './tournaments.html',
  styleUrl: './tournaments.scss',
})
export class Tournaments implements OnInit {
  tournaments$: Observable<Tournament[]>;

  constructor(private readonly tournamentService: TournamentService) {
    this.tournaments$ = this.tournamentService.getAll();
  }

  ngOnInit(): void {}
}