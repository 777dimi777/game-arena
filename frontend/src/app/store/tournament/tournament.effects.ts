import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';

import { TournamentService } from '../../services/tournament';
import { TournamentActions } from './tournament.actions';

@Injectable()
export class TournamentEffects {
  private readonly actions$ = inject(Actions);
  private readonly tournamentService = inject(TournamentService);

  loadTournaments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TournamentActions.loadTournaments),
      mergeMap(() =>
        this.tournamentService.getAll().pipe(
          map((tournaments) =>
            TournamentActions.loadTournamentsSuccess({
              tournaments,
            }),
          ),
          catchError((error) =>
            of(
              TournamentActions.loadTournamentsFailure({
                error:
                  error.error?.message ??
                  'Failed to load tournaments.',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadTournamentDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TournamentActions.loadTournamentDetails),
      mergeMap(({ id }) =>
        this.tournamentService.getById(id).pipe(
          map((tournament) =>
            TournamentActions.loadTournamentDetailsSuccess({
              tournament,
            }),
          ),
          catchError((error) =>
            of(
              TournamentActions.loadTournamentDetailsFailure({
                error:
                  error.error?.message ??
                  'Failed to load tournament details.',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}