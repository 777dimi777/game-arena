import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMatchForm } from './admin-match-form';

describe('AdminMatchForm', () => {
  let component: AdminMatchForm;
  let fixture: ComponentFixture<AdminMatchForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminMatchForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminMatchForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
