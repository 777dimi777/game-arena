import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Game } from '../models/game';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly apiUrl = 'http://localhost:3000/game';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Game[]> {
    return this.http.get<Game[]>(this.apiUrl);
  }

  getById(id: number): Observable<Game> {
    return this.http.get<Game>(`${this.apiUrl}/${id}`);
  }
}