import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Team } from '../models/team';

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
}