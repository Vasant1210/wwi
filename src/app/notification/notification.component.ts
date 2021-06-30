import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NotificationService } from '../_services/notification.service';
import { io} from 'socket.io-client';
import { WebcastService, PollService, AuthenticationService, AppStateService } from '../_services';
import { User, Webcast } from '../_models';
import { NotificationSocketService } from '../_services/notification-socket.service';
import { ActivePoll } from '../_models/active-poll';
import { environment } from '../../environments/environment';
import { RoomService } from '../_services/room.service';
import { GlobalMessage } from '../_models/global-message.model';
import { PerfectScrollbarModule, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { QuestionService } from '../_services/question.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BusinessCardService } from '../_services/business-card.service';
import { BussinessCardType } from '../_models/viewer-bussiness-card';
import { XEventSocketService } from '../_services/x-event-socket.service';
import { Message } from '../xchat/core/message';
import { MessageType } from '../xchat/core/message-type';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  newMessage: string;
  messageList: GlobalMessage[] = [];
  private socket: any;
  public data: any;
  public webcast: Webcast;
  public popupAlertMessage: GlobalMessage;
  public showElement = false;
  scrollConfig: any;
  isMobile: boolean;
  currentUser: User;
  showCardSendBtn: boolean= true;
  showNotifyAlert: boolean = false;
  @ViewChild('perfectScroll', { static: false }) perfectScroll: PerfectScrollbarComponent;
  //@ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;
  constructor(private webcastService: WebcastService, private pollService: PollService,
    private roomService: RoomService,
    private notificationService: NotificationService,
    private questionService: QuestionService,
    private deviceService: DeviceDetectorService,
    private authenticationService: AuthenticationService,
    private businessCardService: BusinessCardService,
    private xEventSocketService: XEventSocketService,
    public appStateService: AppStateService,
  ) {
    this.authenticationService.currentUser.subscribe(x => {
      if (x) {
        this.currentUser = x
        this.socket = io(`${environment.notificationServer}`);    
      }
    });
    // Connect Socket with server URL
    this.isMobile = this.deviceService.isMobile();
  }
  public ngOnInit(): void {
    this.scrollConfig = { suppressScrollX: true }
    this.webcastService.webcast.subscribe(x => {
      this.webcast = x;
      if (x) {
        this.socket.on('webevents_database_presence-' + this.webcast.webcast_id + ':App\\Events\\NotifyUserForAppUpdates', x => {
          
          var data = x["data"]; 
          let message = x["message"];
          let action  = x["action"];         
          let model = data && data["model"] ? data["model"] : null;          
          switch (action) {
            case "RoomPublished":
              if (model) {
                this.roomService.setRoom(model);
                this.showInComingAlert(message);
              }
              break;
            case "QNAUpdated":
              if (model && message && this.currentUser.id == message.viewer_id) {
                  this.questionService.setQuestion(model);
                  this.showInComingAlert(message);
              }
              break;  
            case "MeetingConfirmed":
              if (model && message && this.currentUser.id == message.viewer_id) {
                this.showInComingAlert(message);
              }
              break; 
            case "MeetingReminder":
              if (model && message && this.currentUser.id == message.viewer_id) {
                  this.showInComingAlert(message);
                }
                break; 
            case "BusinesscardRequest":
              if (model && message && this.currentUser.id == message.viewer_id) {
                //console.log(message);
                  this.showInComingAlert(message);
                }
                break; 
            case "BusinesscardReceived": 
              if (model && message && this.currentUser.id == message.viewer_id) {
               // console.log(message);
                  this.showInComingAlert(message);
                }
                break;
            case "NotifyGlobally":
                message = data["message"];
                if (message) {
                  this.showInComingAlert(message);
                }
                break;
            case "NotifyViewer":
                message = x["message"];              
                if (message && this.currentUser.id == message.viewer_id) {
                  this.showInComingAlert(message);
                }
                break;
            case "NotifyCompany":
                message = x["message"];              
                if (message && this.currentUser.id == message.viewer_id) {
                  this.showInComingAlert(message);
                }
                break;
            case "PollPublished":
              var ap: ActivePoll = new ActivePoll();
              ap.pollId = data["poll_id"];
              ap.roomId = data["room_id"];
              ap.poll = data["poll"];
              if (ap.poll) {
                ap.status = ap.poll.status;
              } else {
                ap.status = 2;
              }
              this.pollService.setActivePoll(ap);
              break;
            case "PollResultDeclared":
              var ap: ActivePoll = new ActivePoll();
              ap.pollId = data["poll_id"];
              ap.roomId = data["room_id"];
              ap.poll = data["poll"];
              if (ap.poll) {
                ap.status = ap.poll.status;
              } else {
                ap.status = 3;
              }
              this.pollService.setActivePoll(ap);
              break; 
          }
        });
      }
      
    })
    this.notificationService
      .globalMessage
      .subscribe(x => {
        if (x) {
          this.messageList = x;
         //console.log(x);
          let unseen = x.find(y => y.date_seen== null && y.viewer_id != null);
          if (unseen) {
          this.showNotifyAlert = true;
          }
        }
        //this.perfectScroll.directiveRef.update();
      });
       
  }

  showInComingAlert(message) {
    this.notificationService.addMessage(message);
    //this.messageList.unshift(message);
    this.popupAlertMessage = message;
    this.showNotifyAlert = true;
    this.showElement = true;
    setTimeout(() => {
      this.showElement = false; // Here, value is updated
    }, 30000);
  }

  sendCard(event,message)
  {
    event.stopPropagation();   
    if(message.v_object)
    {
     let m; 
     try
     {  
       m = JSON.parse(message.v_object); 
     }catch(e)
     {
        m = message.v_object; 
     }
      let mid;
      if(m)   
      {
        mid = m.viewer_id;    
      } 
      let messageid=message.id;
      let msg=message.message;
       if(mid)
       {
         let message = new Message();
         message.fromId = this.currentUser.id;
         message.toId = mid;
         message.message = "Business card sent successfully";
         message.dateSent = new Date();
         message.type = MessageType.BCardSent.valueOf();
         this.xEventSocketService.adapter.sendMessage(message);
         this.appStateService.closeChatForUser(mid);
         this.notificationService.cardSeen(this.webcast.webcast_id, messageid, msg).subscribe(z => {
         });
         this.businessCardService.sendCard(this.webcast.webcast_id, mid, BussinessCardType.Viewer.valueOf(), "").subscribe(x => {
          });
         
       }
    }
    return true;
  }

  ignoreCard(event,message)
  {
  
    event.stopPropagation();   
    if(message)
    {
      let messageid=message.id;
      let msg=message.message;
         this.notificationService.ignoreCardSeen(this.webcast.webcast_id, messageid, msg).subscribe(z => {         
         });
    }
    return true;
  }

  preventClose(event) {

    event.stopPropagation();
  }
  markAsRead() {
    this.showNotifyAlert = false;
    this.showElement = false;
    this.notificationService.messageSeen(this.webcast.webcast_id).subscribe();
  }
  dismisspopupAlert() {
    this.showElement = false;
  }
}
