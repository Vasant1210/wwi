import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EzResourceComponent } from './ez-resource.component';

describe('EzResourceComponent', () => {
  let component: EzResourceComponent;
  let fixture: ComponentFixture<EzResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EzResourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EzResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
