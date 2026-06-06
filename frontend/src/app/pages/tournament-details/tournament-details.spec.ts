import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentDetails } from './tournament-details';

describe('TournamentDetails', () => {
  let component: TournamentDetails;
  let fixture: ComponentFixture<TournamentDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TournamentDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(TournamentDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
