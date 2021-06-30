import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EzDetailComponent } from './ez-detail.component';

describe('EzDetailComponent', () => {
  let component: EzDetailComponent;
  let fixture: ComponentFixture<EzDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EzDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EzDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
