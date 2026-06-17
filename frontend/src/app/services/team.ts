import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Team } from '../models/team';
export interface CreateTeamData {
  name: string;
  tag: string;
  logoUrl?: string;
  description?: string;
}
@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private readonly apiUrl = 'http://localhost:3000/team';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Team[]> {
    return this.http.get<Team[]>(this.apiUrl);
  }

  getById(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/${id}`);
  }
  create(data: CreateTeamData): Observable<Team> {
    return this.http.post<Team>(this.apiUrl, data);
  }
}
