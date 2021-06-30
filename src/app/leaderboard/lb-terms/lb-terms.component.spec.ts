import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LbTermsComponent } from './lb-terms.component';

describe('LbTermsComponent', () => {
  let component: LbTermsComponent;
  let fixture: ComponentFixture<LbTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LbTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LbTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
