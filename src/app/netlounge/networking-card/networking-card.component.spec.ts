import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkingCardComponent } from './networking-card.component';

describe('NetworkingCardComponent', () => {
  let component: NetworkingCardComponent;
  let fixture: ComponentFixture<NetworkingCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkingCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
