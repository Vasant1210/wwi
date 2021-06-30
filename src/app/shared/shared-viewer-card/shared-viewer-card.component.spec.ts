import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedViewerCardComponent } from './shared-viewer-card.component';

describe('SharedViewerCardComponent', () => {
  let component: SharedViewerCardComponent;
  let fixture: ComponentFixture<SharedViewerCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedViewerCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedViewerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
