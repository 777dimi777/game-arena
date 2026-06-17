import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Tournament } from '../../models/tournament';

export const TournamentActions = createActionGroup({
  source: 'Tournament',
  events: {
    'Load Tournaments': emptyProps(),

    'Load Tournaments Success': props<{
      tournaments: Tournament[];
    }>(),

    'Load Tournaments Failure': props<{
      error: string;
    }>(),

    'Load Tournament Details': props<{
      id: number;
    }>(),

    'Load Tournament Details Success': props<{
      tournament: Tournament;
    }>(),

    'Load Tournament Details Failure': props<{
      error: string;
    }>(),
    'Create Tournament': props<{
      tournament: {
        name: string;
        description: string;
        startDate: string;
        maxTeams: number;
        prizePool: number;
        status: string;
        gameId: number;
      };
    }>(),

    'Create Tournament Success': props<{
      tournament: Tournament;
    }>(),

    'Create Tournament Failure': props<{
      error: string;
    }>(),
    'Delete Tournament': props<{
      id: number;
    }>(),

    'Delete Tournament Success': props<{
      id: number;
    }>(),

    'Delete Tournament Failure': props<{
      error: string;
    }>(),
  },
});
