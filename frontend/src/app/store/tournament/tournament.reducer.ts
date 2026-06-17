import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Tournament } from '../../models/tournament';
import { TournamentActions } from './tournament.actions';

export const tournamentFeatureKey = 'tournaments';

export interface TournamentState extends EntityState<Tournament> {
  selectedTournament: Tournament | null;
  loading: boolean;
  error: string | null;
}

export const tournamentAdapter = createEntityAdapter<Tournament>();

export const initialTournamentState: TournamentState = tournamentAdapter.getInitialState({
  selectedTournament: null,
  loading: false,
  error: null,
});

export const tournamentReducer = createReducer(
  initialTournamentState,

  on(TournamentActions.loadTournaments, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TournamentActions.loadTournamentsSuccess, (state, { tournaments }) =>
    tournamentAdapter.setAll(tournaments, {
      ...state,
      loading: false,
      error: null,
    }),
  ),

  on(TournamentActions.loadTournamentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TournamentActions.loadTournamentDetails, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TournamentActions.loadTournamentDetailsSuccess, (state, { tournament }) =>
    tournamentAdapter.upsertOne(tournament, {
      ...state,
      selectedTournament: tournament,
      loading: false,
      error: null,
    }),
  ),

  on(TournamentActions.loadTournamentDetailsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TournamentActions.createTournament, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TournamentActions.createTournamentSuccess, (state, { tournament }) =>
    tournamentAdapter.addOne(tournament, {
      ...state,
      loading: false,
      error: null,
    }),
  ),

  on(TournamentActions.createTournamentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TournamentActions.deleteTournament, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TournamentActions.deleteTournamentSuccess, (state, { id }) =>
    tournamentAdapter.removeOne(id, {
      ...state,
      loading: false,
      error: null,
    }),
  ),

  on(TournamentActions.deleteTournamentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
