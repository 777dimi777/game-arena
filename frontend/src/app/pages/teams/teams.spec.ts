import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Teams } from './teams';

describe('Teams', () => {
  let component: Teams;
  let fixture: ComponentFixture<Teams>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Teams],
      imports: [RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Teams);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
