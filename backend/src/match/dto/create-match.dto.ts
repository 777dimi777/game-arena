import { IsInt, IsString } from 'class-validator';

export class CreateMatchDto {
  @IsString()
  scheduledAt!: string;

  @IsInt()
  tournamentId!: number;

  @IsInt()
  teamAId!: number;

  @IsInt()
  teamBId!: number;
}