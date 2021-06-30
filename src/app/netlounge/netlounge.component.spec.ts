import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetloungeComponent } from './netlounge.component';

describe('NetloungeComponent', () => {
  let component: NetloungeComponent;
  let fixture: ComponentFixture<NetloungeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetloungeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetloungeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
