import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Matches } from './matches';

describe('Matches', () => {
  let component: Matches;
  let fixture: ComponentFixture<Matches>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Matches],
      imports: [RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Matches);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
