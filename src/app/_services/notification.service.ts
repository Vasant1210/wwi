import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { io } from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { GlobalMessage } from '../_models/global-message.model';
import { HttpClient } from '@angular/common/http';
import { WebcastService } from './webcast.service';
import { BaseService } from './base.service';
@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseService {
  private _globalMessage: BehaviorSubject<GlobalMessage[]> = new BehaviorSubject<GlobalMessage[]>(null);
  public globalMessage: Observable<GlobalMessage[]>;

  constructor(private http: HttpClient, private webcastService: WebcastService) {
    super();
    this.globalMessage = this._globalMessage.asObservable();
    this.webcastService.webcast.subscribe(x => {
      //console.log("called from notification service");
      this.loadMessage(x.webcast_id).subscribe();
    });
  }

  addMessage(message: GlobalMessage) {
    var currentValue = this._globalMessage.value;
    //currentValue.splice(1, 0, message);
    currentValue.unshift(message);
    this._globalMessage.next(currentValue);
  }

  loadMessage(webcast_id): Observable<GlobalMessage[]> {
    return this.http.get<any>(`${environment.apiUrl}/${webcast_id}/globalnotification`).pipe(
      catchError(this.handleError<GlobalMessage>('loadMessage'))
    ).pipe(map(result => {
      //this.dataStore.webcast = result;
      this._globalMessage.next(result);
      return result;
    }));
  }

  messageSeen(webcast_id) {
    let params = { "webcast_id": webcast_id };
    return this.http.post<any>(`${environment.apiUrl}/${webcast_id}/globalnotification/updatedateseen`, params);
  }

  cardSeen(webcast_id: string, messageid: number, msg: string) {
    let params = { "webcast_id": webcast_id, "messageid":messageid, "msg":msg};
    return this.http.post<any>(`${environment.apiUrl}/${webcast_id}/globalnotification/updatecarddateseen`, params).pipe(map(result => {
      var currentValue = this._globalMessage.value;
      let messageIndex = currentValue.findIndex(x => x.id == messageid);
      currentValue.splice(messageIndex, 1, result)
      this._globalMessage.next(currentValue);
      return result;
    }));;
  }

  ignoreCardSeen(webcast_id: string, messageid: number, msg: string) {
    let params = { "webcast_id": webcast_id, "messageid":messageid, "msg":msg};
    return this.http.post<any>(`${environment.apiUrl}/${webcast_id}/globalnotification/updateignorecarddateseen`, params).pipe(map(result => {
      var currentValue = this._globalMessage.value;
      let messageIndex = currentValue.findIndex(x => x.id == messageid);
      currentValue.splice(messageIndex, 1, result)
      this._globalMessage.next(currentValue);
      return result;
    }));;
  }

  businessCardRequestApproved(webcast_id: string, ofUserId) {
    let message = this._globalMessage.value.find(x => x.action == "BusinesscardRequest" && x.v_object.viewer_id == ofUserId);
    console.log(message);
    if (message) {
      this.cardSeen(webcast_id, message.id, message.message).subscribe();
    }
  }
}
