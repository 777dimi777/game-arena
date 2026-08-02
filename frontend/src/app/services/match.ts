import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Match, MatchStatus } from '../models/match';

export interface CreateMatchData {
  tournamentId: number;
  teamAId: number;
  teamBId: number;
  status?: MatchStatus;
  scheduledAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private readonly apiUrl = 'http://localhost:3000/match';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Match[]> {
    return this.http.get<Match[]>(this.apiUrl);
  }

  create(data: CreateMatchData): Observable<Match> {
    return this.http.post<Match>(this.apiUrl, data);
  }
getByTournament(tournamentId: number): Observable<Match[]> {
  return this.http.get<Match[]>(
    `${this.apiUrl}/tournament/${tournamentId}`,
  );
}
  updateResult(
    id: number,
    scoreA: number,
    scoreB: number,
  ): Observable<Match> {
    return this.http.patch<Match>(`${this.apiUrl}/${id}/result`, {
      scoreA,
      scoreB,
    });
  }
}