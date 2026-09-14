import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginResponse {
  message: string;
  accessToken: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}
export interface CurrentUser {
  id: number;
  username: string;
  email: string;
  role: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/auth';

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
        }),
      );
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(
        atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')),
      ) as { exp?: number };

      if (payload.exp && payload.exp * 1000 <= Date.now()) {
        this.logout();
        return false;
      }

      return true;
    } catch {
      this.logout();
      return false;
    }
  }
  register(username: string, email: string, password: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, {
      username,
      email,
      password,
    });
  }
  getCurrentUser(): CurrentUser | null {
  const user = localStorage.getItem('currentUser');

  if (!user) {
    return null;
  }

    try {
      return JSON.parse(user) as CurrentUser;
    } catch {
      this.logout();
      return null;
    }
  }
}
export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}
