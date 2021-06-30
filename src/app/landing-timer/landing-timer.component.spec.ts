import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingTimerComponent } from './landing-timer.component';

describe('LandingTimerComponent', () => {
  let component: LandingTimerComponent;
  let fixture: ComponentFixture<LandingTimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingTimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
