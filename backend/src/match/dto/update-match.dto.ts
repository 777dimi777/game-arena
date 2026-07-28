import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { MatchStatus } from '../entities/match.entity';

export class UpdateMatchDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  tournamentId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  teamAId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  teamBId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  winnerId?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  scoreA?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  scoreB?: number;

  @IsOptional()
  @IsEnum(MatchStatus)
  status?: MatchStatus;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}