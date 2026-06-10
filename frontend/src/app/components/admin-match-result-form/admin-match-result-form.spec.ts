import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMatchResultForm } from './admin-match-result-form';

describe('AdminMatchResultForm', () => {
  let component: AdminMatchResultForm;
  let fixture: ComponentFixture<AdminMatchResultForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminMatchResultForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminMatchResultForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
