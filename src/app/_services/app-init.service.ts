import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { WebcastService } from './webcast.service';
import { ThemeService } from './theme.service';
import { CustomFormService } from './custom-form.service';
import { Webcast } from '../_models';
import { Theme } from '../_models/theme.model';

@Injectable()
export class AppInitService  {

  constructor(private http: HttpClient, private router: Router,
    private webcastService: WebcastService,
    private themeService: ThemeService,
    private customFormService: CustomFormService
  ) { }

  Init() {
    return new Promise<void>((resolve, reject) => {
      const url = new URL(window.location.href);
      let webcast_id = "";
      if (url.pathname.indexOf('events_app') > 0) {
        webcast_id = url.pathname.split('/')[2];
      } else {
        webcast_id = url.pathname.split('/')[1];
      }
      if (webcast_id) {
        this.getLandingData(webcast_id).subscribe(x => {
          //console.log(x);
          resolve();
        });
      } else {
        resolve();
      }
      resolve();
    });
  }
  getLandingData(webcast_id: string): Observable<Webcast> {
    return this.http.get<any>(`${environment.apiUrl}/${webcast_id}/init`)
      .pipe(
        catchError(this.handleError<any>('init'))
      )
      .pipe(map(result => {
        if (result) {
          this.webcastService.setWebcast(result);
          if (result.forms) {
            this.customFormService.addForm(result.forms);
          }
          if (result.theme) {
            this.themeService.setTheme(result.theme);
          }
          return result;
        }
      }));
    }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      return of(result as T);
    };
  }
}
