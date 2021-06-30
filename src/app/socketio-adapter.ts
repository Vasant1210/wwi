import { Observable, of } from "rxjs";
import { map, catchError } from 'rxjs/operators';
import { io } from 'socket.io-client';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../environments/environment';
import { MessageType } from './xchat/core/message-type';
import { BusinessCardService } from './_services/business-card.service';
import { BussinessCardType } from './_models/viewer-bussiness-card';
import { ChatAdapter } from './xchat/core/chat-adapter';
import { ParticipantResponse } from './xchat/core/participant-response';
import { Message } from './xchat/core/message';


export class SocketIOAdapter extends ChatAdapter {
  private socket: any;
  private http: HttpClient;
  private businessCardService: BusinessCardService;
  private userId: string;
  private webcastId: string;
  constructor(userId: string, socket: any, http: HttpClient, webcastId: string, businessCardService: BusinessCardService) {
    super();
    
    this.socket = socket;
    this.http = http;
    this.userId = userId;
    console.log("Inside Socket Adapter constructor" + this.userId);
    this.webcastId = webcastId;
    this.businessCardService = businessCardService;
    this.InitializeSocketListerners();
    
  }

  listFriends(): Observable<ParticipantResponse[]> {
    // List connected users to show in the friends list
    // Sending the userId from the request body as this is just a demo 
    console.log("getting friend list " + this.userId);
    return this.http
      .post<ParticipantResponse[]>(`${environment.chatServer}/listFriends`, { userId: this.userId, roomId: this.webcastId })
      .pipe(
        map(res => {
          console.log(res);
          return res.sort((x, y) => x.participant.status - y.participant.status);
        }),
        catchError((error: any) => Observable.throw(error.json().error || 'Server error'))
      );
  }

  getMessageHistory(userId: any): Observable<Message[]> {
    // This could be an API call to your NodeJS application that would go to the database
    // and retrieve a N amount of history messages between the users.
    return this.http
      .post<Message[]>(`${environment.chatServer}/getMessageHistory`, { userId: userId, participantId: this.userId })
      .pipe(
        map(res => {
          console.log(res);
          return res;
        }),
        catchError((error: any) => Observable.throw(error.json().error || 'Server error'))
      );
  }

  getConversations(): Observable<ParticipantResponse[]> {
    // This could be an API call to your NodeJS application that would go to the database
    // and retrieve a N amount of history messages between the users.
    return this.http
      .post<ParticipantResponse[]>(`${environment.chatServer}/listConversations`, { userId: this.userId })
      .pipe(
        map(res => {
          console.log(res);
          return res;
        }),
        catchError((error: any) => Observable.throw(error.json().error || 'Server error'))
      );
  }

  sendMessage(message: Message): void {
    switch(message.type) {
      case MessageType.BCardRequested.valueOf():
        this.businessCardService.requestCard(this.webcastId, message.toId, BussinessCardType.Viewer.valueOf(), "").subscribe();
        break;
      case MessageType.BCardSent.valueOf():
        this.businessCardService.sendCard(this.webcastId, message.toId, BussinessCardType.Viewer.valueOf(), "").subscribe();
        break;
    }
    if (this.socket) {
      this.socket.emit("sendMessage", message);
    }
  }

  public InitializeSocketListerners(): void {
    //console.log("InitializeSocketListerners in adapter" + this.userId);
    this.socket.on("messageReceived", (messageWrapper) => {
      // Handle the received message to ng-chat
      this.onMessageReceived(messageWrapper.user, messageWrapper.message);
    });
    this.socket.on('disconnect', function () {
      console.log("I am docsinnected");
    });
    this.socket.on("friendsListChanged", (usersCollection: Array<ParticipantResponse>) => {
      // Handle the received message to ng-chat
      console.log("firned list changed fired " + this.userId);
      console.log(usersCollection);
      let me = usersCollection.find(x => x.participant.id == this.userId);
      console.log(me);
      if (me && me.participant.socketId == null) {
        this.onFriendsListChanged([]);
      } else {
        this.onFriendsListChanged(usersCollection.filter(x => x.participant.id != this.userId).sort((x, y) => x.participant.status - y.participant.status));
      }
      
    });
  }
}
