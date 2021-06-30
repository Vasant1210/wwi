import { Injectable } from '@angular/core';
import { WebcastService } from './webcast.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Theme } from '../_models/theme.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  public _theme: BehaviorSubject<Theme> = new BehaviorSubject<Theme>(new Theme());
  private dataStore: { theme: Theme } = { theme: new Theme() };

  constructor() { }

  get theme(): Observable<Theme> {
    return this._theme;
  }

  setTheme(theme: Theme) {
    this.dataStore.theme = theme;
    this._theme.next(Object.assign({}, this.dataStore).theme);
  }
}
