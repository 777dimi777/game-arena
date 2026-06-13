import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaderboardItem } from '../models/leaderboard-item';
import { Tournament } from '../models/tournament';
export interface CreateTournamentData {
  name: string;
  description: string;
  startDate: string;
  maxTeams: number;
  prizePool: number;
  status?: string;
  gameId: number;
}
@Injectable({
  providedIn: 'root',
})
export class TournamentService {
  private readonly apiUrl = 'http://localhost:3000/tournament';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(this.apiUrl);
  }

  getById(id: number): Observable<Tournament> {
    return this.http.get<Tournament>(`${this.apiUrl}/${id}`);
  }
  create(data: CreateTournamentData): Observable<Tournament> {
    return this.http.post<Tournament>(this.apiUrl, data);
  }
  joinTournament(tournamentId: number, teamId: number): Observable<Tournament> {
    return this.http.post<Tournament>(`${this.apiUrl}/${tournamentId}/join/${teamId}`, {});
  }
  getLeaderboard(tournamentId: number): Observable<LeaderboardItem[]> {
    return this.http.get<LeaderboardItem[]>(`${this.apiUrl}/${tournamentId}/leaderboard`);
  }
}
