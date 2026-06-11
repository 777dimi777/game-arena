import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  TournamentState,
  tournamentAdapter,
  tournamentFeatureKey,
} from './tournament.reducer';

export const selectTournamentState =
  createFeatureSelector<TournamentState>(tournamentFeatureKey);

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = tournamentAdapter.getSelectors();

export const selectAllTournaments = createSelector(
  selectTournamentState,
  selectAll,
);

export const selectTournamentEntities = createSelector(
  selectTournamentState,
  selectEntities,
);

export const selectTournamentIds = createSelector(
  selectTournamentState,
  selectIds,
);

export const selectTournamentTotal = createSelector(
  selectTournamentState,
  selectTotal,
);

export const selectSelectedTournament = createSelector(
  selectTournamentState,
  (state) => state.selectedTournament,
);

export const selectTournamentLoading = createSelector(
  selectTournamentState,
  (state) => state.loading,
);

export const selectTournamentError = createSelector(
  selectTournamentState,
  (state) => state.error,
);