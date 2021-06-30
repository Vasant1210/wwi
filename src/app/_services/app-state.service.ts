import { Injectable } from '@angular/core';
import { AppState } from '../_models';
import { Observable, BehaviorSubject, of } from 'rxjs';



@Injectable({ providedIn: 'root' })
export class AppStateService {
  private appStateSubject: BehaviorSubject<AppState>;
  public appState: Observable<AppState>;

  constructor() {
    this.appStateSubject = new BehaviorSubject<AppState>(new AppState());
    this.appState = this.appStateSubject.asObservable();

  }

  public getSettings() {
    return this.appStateSubject.getValue();
  }
  
  public updateAppSettings(setting: AppState) {
    console.log(setting);
    return this.appStateSubject.next(setting);
  }

  public showChat(flag: boolean) {
    var currentValue = this.appStateSubject.value;
    if (currentValue) {
      currentValue.showChat = flag;
    } else {
      let astate = new AppState();
      astate.showChat = flag;
      currentValue = astate;
    }
    this.appStateSubject.next(currentValue);
  }
  public openChatForUser(userId) {
    var currentValue = this.appStateSubject.value;
    if (currentValue) {
      currentValue.showChat = true;
      currentValue.triggerChatUserId = userId;
    } else {
      let astate = new AppState();
      astate.showChat = true;
      astate.triggerChatUserId = userId;
      currentValue = astate;
    }
    this.appStateSubject.next(currentValue);
  }
  public closeChatForUser(userId) {
    var currentValue = this.appStateSubject.value;
    if (currentValue) {
      currentValue.showChat = false;
      currentValue.triggerChatUserId = null;
      currentValue.triggerCloseChatWindowUserId = userId;
    } else {
      let astate = new AppState();
      astate.showChat = false;
      astate.triggerCloseChatWindowUserId = userId;
      astate.triggerChatUserId = null;
      currentValue = astate;
    }
    this.appStateSubject.next(currentValue);
  }

  public setGlobalChatAlert(flag) {
    var currentValue = this.appStateSubject.value;
    if (currentValue) {
      currentValue.globalChatAlert = flag;
    } else {
      let astate = new AppState();
      astate.globalChatAlert = flag;
      currentValue = astate;
    }
    this.appStateSubject.next(currentValue);
  }
}
