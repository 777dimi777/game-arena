import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { MatchService } from './match';

describe('MatchService', () => {
  let service: MatchService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(MatchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
