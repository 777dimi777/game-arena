import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { TeamService } from './team';

describe('TeamService', () => {
  let service: TeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(TeamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
