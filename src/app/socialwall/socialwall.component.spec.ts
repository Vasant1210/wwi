import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialwallComponent } from './socialwall.component';

describe('SocialwallComponent', () => {
  let component: SocialwallComponent;
  let fixture: ComponentFixture<SocialwallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialwallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialwallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
