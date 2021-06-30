import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XchatWindowComponent } from './xchat-window.component';

describe('XchatWindowComponent', () => {
  let component: XchatWindowComponent;
  let fixture: ComponentFixture<XchatWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XchatWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XchatWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
