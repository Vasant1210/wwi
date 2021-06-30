import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { User } from '../_models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusinessCardService {

  currentUser: User;
  constructor(private http: HttpClient, private authService: AuthenticationService) {
    this.authService.currentUser.subscribe(x => {
      if (x) {
        this.currentUser = x;
      }
    })
  }

  addCard(webcast_id: string, model_id: number, model_type: string, cards: string) {
    let params = { "webcast_id": webcast_id, "model_id": model_id, "model_type": model_type, "cards": cards };
    return this.http.post<any>(`${environment.apiUrl}/${webcast_id}/viewer/bussinesscard/create`, params);
  }
  requestCard(webcast_id: string, fromId: number, model_type: string, cards: string) {
    let params = { "webcast_id": webcast_id, "model_id": fromId, "model_type": model_type, "cards": cards };
    return this.http.post<any>(`${environment.apiUrl}/${webcast_id}/viewer/bussinesscard/request`, params);
  }
  sendCard(webcast_id: string, toId: number, model_type: string, cards: string) {
    let _card = JSON.stringify(this.currentUser.profile);
    let params = { "webcast_id": webcast_id, "to_id": toId, "model_type": model_type, "cards": _card };
    return this.http.post<any>(`${environment.apiUrl}/${webcast_id}/viewer/bussinesscard/send`, params);
  } 

  getCardFlags(webcast_id: string,chat_user_id:number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/${webcast_id}/viewer/bussinesscard/getcardflags/${chat_user_id}`);
  }


}
