import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { io } from 'socket.io-client';
import { AuthenticationService } from './authentication.service';
import { User, Webcast } from '../_models';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { WebcastService } from './webcast.service';
import { SocketIOAdapter } from '../socketio-adapter';
import { BusinessCardService } from './business-card.service';
import { ChatAdapter } from '../xchat/core/chat-adapter';

@Injectable({
  providedIn: 'root'
})
export class XEventSocketService{

  private socket: any;
  adapter: ChatAdapter;
  socketUsetId: any;

  constructor(private http: HttpClient,private businessCardService: BusinessCardService) {
  }

  connect(webcast_id, user: User) {
    if (webcast_id && user) {
      this.socket = io(`${environment.chatServer}`);
      this.InitializeSocketListerners(webcast_id, user);
      this.joinEvent(webcast_id, user);
      }
  }
  public joinEvent(webcast_id, user: User) {
    if (user && user.hasProfile) {
      let profile_pic = user.profile && user.profile.profile_pic ? user.profile.profile_pic : "";
      let company = user.profile ? user.profile["Company Name"] : "";
      //this.socket.emit("join", { user_id: this.currentUser.id, user_name: this.currentUser.fullName, room_id: this.webcast.webcast_id, avtar: profile_pic });
      console.log("join evenet called" + user.id);
      this.socket.emit("join", webcast_id, user.id, user.fullName, profile_pic, company);
    }
  }

  public leaveEvent(webcast_id, user: User) {
    console.log("leaing room");
    if (this.socket) {
      this.socket.emit("leaveRoom", webcast_id, user.id, user.fullName, "", "");
    }
  }
  public InitializeSocketListerners(webcast_id, user: User): void {
    console.log("init socket called from service " +  user.id.toString());
    this.socket.on("generatedUserId", (userId) => {
      console.log("generated event fired " + user.id);
      this.adapter = new SocketIOAdapter(user.id.toString(), this.socket, this.http, webcast_id, this.businessCardService);
      this.socketUsetId = userId;
    });
    
  }

  public onParticipantChatOpened(participant: any, webcast_id: string) {
    let params = { "webcast_id": webcast_id, "fromId": participant.id };
    return this.http.post<any>(`${environment.apiUrl}/${webcast_id}/viewer/chatmessage/seen`, params).subscribe();
  }
}
