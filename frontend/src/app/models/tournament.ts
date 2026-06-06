export interface Game {
  id: number;
  name: string;
  genre: string;
  teamSize: number;
  imageUrl?: string;
}

export interface Team {
  id: number;
  name: string;
  tag: string;
  logoUrl?: string;
  description?: string;
}

export interface Tournament {
  id: number;
  name: string;
  description: string;
  startDate: string;
  maxTeams: number;
  prizePool: number;
  status: string;
  game: Game;
  teams: Team[];
}