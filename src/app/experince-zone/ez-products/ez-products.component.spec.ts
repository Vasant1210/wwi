import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EzProductsComponent } from './ez-products.component';

describe('EzProductsComponent', () => {
  let component: EzProductsComponent;
  let fixture: ComponentFixture<EzProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EzProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EzProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
