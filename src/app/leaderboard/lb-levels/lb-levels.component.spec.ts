import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LbLevelsComponent } from './lb-levels.component';

describe('LbLevelsComponent', () => {
  let component: LbLevelsComponent;
  let fixture: ComponentFixture<LbLevelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LbLevelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LbLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
