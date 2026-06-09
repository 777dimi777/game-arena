import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTournamentForm } from './admin-tournament-form';

describe('AdminTournamentForm', () => {
  let component: AdminTournamentForm;
  let fixture: ComponentFixture<AdminTournamentForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminTournamentForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTournamentForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
