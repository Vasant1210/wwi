import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams, HttpErrorResponse  } from '@angular/common/http';import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../_models';
import { WebcastService } from './webcast.service';
import { CursorError } from '@angular/compiler/src/ml_parser/lexer';
/*import { CometChatService } from './comet-chat.service';*/


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    longitude:number=0.0;
  latitude: number = 0.0;

  constructor(private http: HttpClient, private webcastService: WebcastService
    /*, private cometChatService: CometChatService*/
  ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }   

  public get currentUserValue(): User {
    if (this.currentUserSubject) {
      return this.currentUserSubject.value;
    }else return null;
    }


  updateProfile(profile) {
    var current = this.currentUserSubject.value;
    if (current) {
      current.hasProfile = true;
      current.profile = profile;
      current.fullName = profile['Full Name'];
      localStorage.setItem('currentUser', JSON.stringify(current));
      this.currentUserSubject.next(current);
    }
    }
    /*public get currentUserSettings() {
        if(this.currentUserValue && this.currentUserValue.user && this.currentUserValue.user.settings)
        {
            return this.currentUserValue.user.settings;
        }
        return null;
    }*/
  register(login_field: string, webcast_id: string, form_fields: string,lat: number, lng: number,) {
    let params = { login_field: login_field, webcast_id: webcast_id, form_fields: form_fields, "lat": lat, "lng": lng};
    return this.http.post<any>(`${environment.apiUrl}/${webcast_id}/auth/register`, params)
      .pipe(map(data => {
        if (data.error || data.success) {
          return data;
        }
        localStorage.setItem('currentUser', JSON.stringify(data.viewer));
        this.currentUserSubject.next(data.viewer);
        return data.viewer;
      }));;
    }
    login(login_field: string, password: string,webcast_id:string,lat:number,lng:number) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            }); 
         let params = {"login_field":login_field,"password":password,"lat":lat,"lng":lng};  
        let options = { headers: headers };   
        return this.http.post<any>(`${environment.apiUrl}/${webcast_id}/auth/viewer`,params,options )
          .pipe(map(data => {
                if(data.error){
                    return data;
            }
            if (!this.webcastService.hasWidget("loginByOTP")) {
              
                localStorage.setItem('currentUser', JSON.stringify(data.viewer));
              this.currentUserSubject.next(data.viewer);
              /*this.cometChatService.login(data.viewer);*/
                return data.viewer;
            }
            return data;
        }));
    }
    verfiyOTP(otp: string, login_field: string, webcast_id: string) {
    let params = { otp: otp, login_field: login_field, webcast_id: webcast_id };
        return this.http.post<any>(`${environment.apiUrl}/${webcast_id}/auth/verifyotp`, params)
          .pipe(map(data => {
            if (data.error) {
              return data;
            }
            
            localStorage.setItem('currentUser', JSON.stringify(data.viewer));
            this.currentUserSubject.next(data.viewer);
            /*this.cometChatService.login(data.viewer);*/
            return data.viewer;
          }));;
      }
    loginbyToken()
    {
        
        return this.http.get<any>(`${environment.apiUrl}/viewer/authenticate/`+ this.currentUserValue.api_token)
        .pipe(map(user => {
            // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
            //user.authdata = window.btoa(email + ':' + password);
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            return user;
        }));
        
    }
    init_logout(user) {
        if(user){
            let webcast_id =user.webcast_id;
            let headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + user.api_token,
                }); 
            let options = { headers: headers };   
            let params = {};  
            return this.http.post<any>(`${environment.apiUrl}/${webcast_id}/auth/logout`,params,options);
        }
        return null;
    }
    
    logout() {
        localStorage.removeItem('attended_poll_list');
        localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
      /*this.cometChatService.logout();*/
        
    }
    
    
}
