import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Match } from '../models/match';
export interface CreateMatchData {
  scheduledAt: string;
  tournamentId: number;
  teamAId: number;
  teamBId: number;
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

  getById(id: number): Observable<Match> {
    return this.http.get<Match>(`${this.apiUrl}/${id}`);
  }
  create(data: CreateMatchData): Observable<Match> {
  return this.http.post<Match>(this.apiUrl, data);
}
}