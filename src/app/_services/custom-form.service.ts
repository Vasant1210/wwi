import { Injectable } from '@angular/core';
import { Router } from '@angular/router'; 
import { HttpClient,HttpHeaders,HttpParams  } from '@angular/common/http';
import { BehaviorSubject, Observable,throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Cform} from '../../app/_models';
import { CustomForm } from '../_models/custom-form';
import {ViewersProfile} from '../_models/viewers-profile.model'
@Injectable({ providedIn: 'root' })
export class CustomFormService {

  public _customForm: BehaviorSubject<CustomForm[]> = new BehaviorSubject<CustomForm[]>([]);
  private dataStore: { customForm: CustomForm[] } = { customForm: [] };
   
  constructor(private http: HttpClient, private router: Router) {

  }

  addForm(form) {
    this.dataStore.customForm.push(form);
    this._customForm.next(Object.assign({}, this.dataStore).customForm);
  }

  /// get custom form for webcast by form name
  getFormByFormName(webcastId: string, formName: string): Observable<CustomForm> {
    return this.http.get<CustomForm>(`${environment.apiUrl}/${webcastId}/form/${formName}`)
      .pipe(
        catchError(this.handleError<CustomForm>('getForm'))
      );
  }

  /// get custom form for webcast by form name
  getForm(webcastId: string, formName: string): Observable<Cform> {
    return this.http.get<Cform>(`${environment.apiUrl}/${webcastId}/form/${formName}`)
     .pipe(
        catchError(this.handleError<Cform>('getForm'))
    );
  }
  saveFeedback(webcastId: string, formFields: string, lat: number, lng: number) {
    let params = { webcast_id: webcastId, form_fields: formFields, "lat": lat, "lng": lng };
    return this.http.post<any>(`${environment.apiUrl}/${webcastId}/viewer/feedback`, params)
      .pipe(map(data => {
        if (data.error || data.success) {
          //console.log(data);
          return data;
        }
      }));;
  }
  getProfile(webcastId: string): Observable<CustomForm> {
    return this.http.get<CustomForm>(`${environment.apiUrl}/${webcastId}/profile`)
      .pipe(
        catchError(this.handleError<CustomForm>('getForm'))
      );
  }

  getMatchingProfile(webcastId: string): Observable<ViewersProfile[]> {
    return this.http.get<any>(`${environment.apiUrl}/${webcastId}/networking`)
  }

  saveProfile(webcastId: string, formFields: string ,lat: number, lng: number) {
    let params = { webcast_id: webcastId, form_fields: formFields, "lat": lat, "lng": lng };
    return this.http.post<any>(`${environment.apiUrl}/${webcastId}/viewer/profile`, params)
      .pipe(map(data => {
        if (data.error || data.success) {
          //console.log(data);
          return data;
        }
      }));;
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      return of(result as T);
    };
  }

  public getFieldLabel(cform,fieldName) {
    let fld = "";
    if (cform.fields.length > 0) {
      cform.fields.forEach(function (obj) {
        if (obj['fldname'] == fieldName) {
          fld = obj['label'];
        }
      });
      return fld;
    }
  }
}
