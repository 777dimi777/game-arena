export class CreateGameDto {
  name!: string;
  genre!: string;
  teamSize!: number;
  imageUrl?: string;
}