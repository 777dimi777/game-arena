import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Game } from '../models/game';
export interface CreateGameData {
  name: string;
  genre: string;
  teamSize: number;
  imageUrl?: string;
}
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
  create(data: CreateGameData): Observable<Game> {
  return this.http.post<Game>(this.apiUrl, data);
}
}