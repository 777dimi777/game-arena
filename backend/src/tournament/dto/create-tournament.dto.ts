import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateTournamentDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsString()
  startDate!: string;

  @IsInt()
  @Min(2)
  maxTeams!: number;

  @IsNumber()
  @Min(0)
  prizePool!: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsInt()
  gameId!: number;
}