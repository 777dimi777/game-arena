import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGameForm } from './admin-game-form';

describe('AdminGameForm', () => {
  let component: AdminGameForm;
  let fixture: ComponentFixture<AdminGameForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminGameForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminGameForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
