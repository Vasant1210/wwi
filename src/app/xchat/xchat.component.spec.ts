import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XchatComponent } from './xchat.component';

describe('XchatComponent', () => {
  let component: XchatComponent;
  let fixture: ComponentFixture<XchatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XchatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
