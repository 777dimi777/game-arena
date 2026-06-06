import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';

import { Tournament } from '../../models/tournament';
import { TournamentService } from '../../services/tournament';

@Component({
  selector: 'app-tournament-details',
  standalone: false,
  templateUrl: './tournament-details.html',
  styleUrl: './tournament-details.scss',
})
export class TournamentDetails implements OnInit {
  tournament$!: Observable<Tournament>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly tournamentService: TournamentService,
  ) {}

  ngOnInit(): void {
    this.tournament$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = Number(params.get('id'));
        return this.tournamentService.getById(id);
      }),
    );
  }
}