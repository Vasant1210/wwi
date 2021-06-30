import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperinceZoneComponent } from './experince-zone.component';

describe('ExperinceZoneComponent', () => {
  let component: ExperinceZoneComponent;
  let fixture: ComponentFixture<ExperinceZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperinceZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperinceZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
