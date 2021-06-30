import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XchatFriendsListComponent } from './xchat-friends-list.component';

describe('XchatFriendsListComponent', () => {
  let component: XchatFriendsListComponent;
  let fixture: ComponentFixture<XchatFriendsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [XchatFriendsListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XchatFriendsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
