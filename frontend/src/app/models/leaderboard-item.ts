export interface LeaderboardItem {
  teamId: number;
  teamName: string;
  tag: string;
  playedMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  points: number;
}