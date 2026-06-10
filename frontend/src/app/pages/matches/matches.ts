import { Component } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

import { Match } from '../../models/match';
import { MatchService } from '../../services/match';

@Component({
  selector: 'app-matches',
  standalone: false,
  templateUrl: './matches.html',
  styleUrl: './matches.scss',
})
export class Matches {
  matches$: Observable<Match[]>;

  constructor(private readonly matchService: MatchService) {
    this.matches$ = this.matchService.getAll().pipe(
      shareReplay({
        bufferSize: 1,
        refCount: true,
      }),
    );
  }
}