import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateGameDto {
  @IsString()
  name!: string;

  @IsString()
  genre!: string;

  @IsInt()
  @Min(1)
  teamSize!: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}