import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { MatchStatus } from '../entities/match.entity';

export class CreateMatchDto {
  @IsInt()
  @Min(1)
  tournamentId!: number;

  @IsInt()
  @Min(1)
  teamAId!: number;

  @IsInt()
  @Min(1)
  teamBId!: number;

  @IsOptional()
  @IsEnum(MatchStatus)
  status?: MatchStatus;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}