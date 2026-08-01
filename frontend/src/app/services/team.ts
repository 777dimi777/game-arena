import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Team } from '../models/team';
import { TeamProfile } from '../models/team-profile';

export interface CreateTeamData {
  name: string;
  tag: string;
  logoUrl?: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class TeamService {
  private readonly apiUrl = 'http://localhost:3000/team';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Team[]> {
    return this.http.get<Team[]>(this.apiUrl);
  }

  getById(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/${id}`);
  }

  getProfile(id: number): Observable<TeamProfile> {
    return this.http.get<TeamProfile>(`${this.apiUrl}/${id}/profile`);
  }

  create(data: CreateTeamData): Observable<Team> {
    return this.http.post<Team>(this.apiUrl, data);
  }
}
