import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiStatusService {
  private readonly apiUrl = 'http://localhost:3000';

  async check(): Promise<boolean> {
    const response = await fetch(this.apiUrl);
    return response.ok;
  }
}
