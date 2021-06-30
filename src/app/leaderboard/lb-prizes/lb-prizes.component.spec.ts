import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LbPrizesComponent } from './lb-prizes.component';

describe('LbPrizesComponent', () => {
  let component: LbPrizesComponent;
  let fixture: ComponentFixture<LbPrizesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LbPrizesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LbPrizesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
