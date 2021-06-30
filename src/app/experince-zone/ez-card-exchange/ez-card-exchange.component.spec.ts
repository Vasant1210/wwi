import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EzCardExchangeComponent } from './ez-card-exchange.component';

describe('EzCardExchangeComponent', () => {
  let component: EzCardExchangeComponent;
  let fixture: ComponentFixture<EzCardExchangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EzCardExchangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EzCardExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
