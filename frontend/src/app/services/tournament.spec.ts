import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { TournamentService } from './tournament';

describe('TournamentService', () => {
  let service: TournamentService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(TournamentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
