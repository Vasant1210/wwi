import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, tap, catchError, filter } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Webcast } from '../_models';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WebcastService {
  //JSON.parse(localStorage.getItem('webcast'))
  public _webcast: BehaviorSubject<Webcast> = new BehaviorSubject<Webcast>(null);
  public webcast: Observable<Webcast>;

  //private dataStore: { webcast: Webcast } = { webcast: new Webcast() };


  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.webcast = this._webcast.asObservable();
  }

 /* get webcast(): Observable<Webcast> {
    return this._webcast;
  }*/

  hasWidget(name) {
    var result = false;
    this.webcast.subscribe(x => {
      if (x) {
        var widgets = x.widgets;
        let widets = widgets;
        if (widgets) {
          if (!Array.isArray(widgets)) {
            widets = JSON.parse(widgets);
          }
          let enbabled = widets.filter(x => x.includes(name));
          result = enbabled.length > 0;
        }
      }
    });
    return result;
  }

  setWebcast(webcast: Webcast) {
    //this.dataStore.webcast = webcast;
    //localStorage.setItem('webcast', JSON.stringify(webcast));
    this._webcast.next(webcast);
  }

  getWebcastData(webcast_id: string): Observable<Webcast> {
    if (this._webcast.value.id <= 0) {
      return this.loadWebcast(webcast_id);
    } 
    return this._webcast;
  }

  loadWebcast(webcast_id: string): Observable<Webcast> {
    console.log("This a database hit to get webcast data");
    return this.http.get<Webcast>(`${environment.apiUrl}/webcast/${webcast_id}`)
    .pipe(
        catchError(this.handleError<Webcast>('getWebcast'))
    ).pipe(map(result => {
        //this.dataStore.webcast = result;
        //this._webcast.next(result);
        return result;
      }));;
  }

  getWebcast(webcast_id: string): Observable<Webcast> {
    return this.http.get<Webcast>(`${environment.apiUrl}/webcast/${webcast_id}`)
      .pipe(
        catchError(this.handleError<Webcast>('getWebcast'))
    ).pipe(map(result => {
        //this.dataStore.webcast = result;
        //this._webcast.next(result);
        return result;
      }));;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log("eroro");
      console.error(error); // log to console instead
      return of(result as T);
    };
  }
  getWebcastStatusFeed(webcast_id) {
    return this.http.get<any>(`${environment.apiUrl}/${webcast_id}/status_stream?feed=json`);
  }

  destroy() {
    localStorage.removeItem('webcast');
    this._webcast.next(null);
  }

  redirectToHome(onlogin: boolean = false) {
    if (this._webcast) {
      if (onlogin === true) {
        if (this._webcast.value.detail && this._webcast.value.detail.ornt_video && this._webcast.value.detail.ornt_video != "") {
          this.router.navigate([`${this._webcast.value.webcast_id}/welcome`]);
        }
        else {
          this.router.navigate([`${this._webcast.value.webcast_id}/lobby`]);
        }
      } else {
        this.router.navigate([`${this._webcast.value.webcast_id}/lobby`]);
      }
    }
  }
}
