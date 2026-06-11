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
  },
});