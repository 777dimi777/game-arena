export type ActivityType =
  | 'MATCH_FINISHED'
  | 'MATCH_LIVE'
  | 'MATCH_SCHEDULED'
  | 'MATCH_CANCELLED'
  | 'TOURNAMENT_OPEN'
  | 'TOURNAMENT_ONGOING'
  | 'TOURNAMENT_FINISHED'
  | 'TOURNAMENT_CANCELLED';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  subtitle: string;
  timestamp?: string | null;
  statusLabel: string;
  icon: string;
  link: string;
}