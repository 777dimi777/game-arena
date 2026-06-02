export class CreateTournamentDto {
  name!: string;
  description!: string;
  startDate!: string;
  maxTeams!: number;
  prizePool!: number;
  status?: string;
  gameId!: number;
}