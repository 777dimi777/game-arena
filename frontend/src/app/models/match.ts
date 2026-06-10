import { Team } from './team';
import { Tournament } from './tournament';

export interface Match {
  id: number;
  scheduledAt: string;
  scoreA: number;
  scoreB: number;
  tournament: Tournament;
  teamA: Team;
  teamB: Team;
  winner?: Team;
}