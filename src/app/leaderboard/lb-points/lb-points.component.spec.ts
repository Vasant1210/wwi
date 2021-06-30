import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LbPointsComponent } from './lb-points.component';

describe('LbPointsComponent', () => {
  let component: LbPointsComponent;
  let fixture: ComponentFixture<LbPointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LbPointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LbPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
