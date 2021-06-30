import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EzHelpdeskComponent } from './ez-helpdesk.component';

describe('EzHelpdeskComponent', () => {
  let component: EzHelpdeskComponent;
  let fixture: ComponentFixture<EzHelpdeskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EzHelpdeskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EzHelpdeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
