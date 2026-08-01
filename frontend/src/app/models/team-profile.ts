import { Match } from './match';
import { Team } from './team';

export interface TeamProfile {
  team: Team;
  matches: Match[];
  playedMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  badges: string[];
}
