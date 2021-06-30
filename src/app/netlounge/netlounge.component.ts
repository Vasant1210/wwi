import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RoomService } from '../_services/room.service';
import { Lounge, Room } from '../_models/room.model';
import { WebcastService, AuthenticationService, AppStateService } from '../_services';
import { Router } from '@angular/router';
import { Webcast, User } from '../_models';
import { SpeakerMeetingSlot } from '../_models/speaker-meeting-slot.model';
import { SpeakerService } from '../_services/speaker.service';
import { Speaker } from '../_models/speaker';
import { FormControl, Validators } from '@angular/forms';
import { StatsService } from '../_services/stats.service';
import { Stats } from '../_models/user-stats.model';
import { Subject} from 'rxjs';
import { DatePipe } from '@angular/common';
import { GuidedTourService, ProgressIndicatorLocation } from 'ngx-guided-tour';
import { XTour, XTourSteps } from '../_models/guided-tour';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-netlounge',
  templateUrl: './netlounge.component.html',
  styleUrls: ['./netlounge.component.css']
})
export class NetloungeComponent implements OnInit {  
  @Output() onClose = new EventEmitter<any>();
  parentSubject:Subject<string> = new Subject();
  //loadLounge
  lounge: Room;
  speakerMeetingSlot:SpeakerMeetingSlot[]; 
  viewerMeetingSchedule: SpeakerMeetingSlot[];
  speakers:Speaker[];
  speaker:Speaker[];
  assets: [];
  lounge_bgimage:string="";
  lounge_schedule_image:string;
  lounge_attende_image:string;
  webcast: Webcast;
  currentUser: User;
  loading = false;
  error = "";
  success = "";
  isLoaded = false;
  selectedSlot:any;
  selectedSchedule:any;
  selectedSpeaker:Speaker;
  speaker_name="";
  start_time="";
  end_time="";
  activeMode = '';
  showChatAlert: boolean = false;
  openChat = false;
  
  constructor(private webcastService: WebcastService, private roomService: RoomService, private speakerService: SpeakerService, private statsService: StatsService, public datepipe: DatePipe, private authenticationService: AuthenticationService, private router: Router, private appStateService: AppStateService, public guidedTourService: GuidedTourService, private spinner: NgxSpinnerService) { }
  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x
      if (this.currentUser && !this.currentUser.hasProfile) {
        this.router.navigate([`${this.currentUser.webcast_id}/profile`]);
      }
    });
    this.spinner.show();
    
    this.webcastService.webcast.subscribe(x => {
      if (x) {
        this.spinner.hide();    
        this.activeMode ='';
        this.webcast = x;
        this.loadLounge(); 
        this.error="";
        this.success="";
        this.statsService.trackActivity(this.webcast.webcast_id, 'view_networking_lounge');    
        this.appStateService.appState.subscribe(x => {
          if (x) {
            this.showChatAlert = x.globalChatAlert;
          }
        });
      
      }
    });  

    
  
  }

  loadLounge() {
    this.roomService.getRoomByType(this.webcast.webcast_id, 'lounge');
    this.roomService.rooms.subscribe(
      x => {  
      if(x)
      {
        this.lounge = x.find(x => x.room_type == 'lounge');
        if (this.lounge) {
          this.lounge_bgimage = this.lounge.bgimage;
          if (this.lounge["assets"]) {
            this.assets = JSON.parse(this.lounge["assets"])
            this.lounge_attende_image = this.assets["attend_meeting_image"];
            this.lounge_schedule_image = this.assets["schedule_meeting_image"];
          }
        }
      }
      });
  }

  loadMeetingSlot(speaker_id:number)
  {
      console.log(speaker_id);
      console.log(this.speakers);
      
      let _speaker= this.speakers.find(x => x.id ==  speaker_id);
      
      //console.log(_speaker);
      if(_speaker){
        this.speaker_name =  _speaker.spe_name;
        this.speakerMeetingSlot  = _speaker.speaker_meeting_slot;
      }
  }

  loadSpeakerSlot()
  {   
    this.speakerService.loadSpeakerSlot(this.webcast.webcast_id).subscribe(
      x => {  
      if(x)
      {
        this.isLoaded = true;
          this.speakers =x;   
          this.selectedSpeaker =  x[0];
          if(x[0]){
            this.loadMeetingSlot(x[0].id);     
          }
          //console.log(this.speakers);       
        }
      });
  }

  loadViewerSchedule()
  {
    this.speakerService.loadViewerMeetingSchedule(this.webcast.webcast_id).subscribe(
      x => {  
      if(x)
        {
          console.log("viewerMeeting");
          console.log(x);
          this.viewerMeetingSchedule =x;
          this.activeMode =  'attend_popup';
          console.log(this.viewerMeetingSchedule);       
        }
      });

  }


  closePopup(popName='')
  {
    this.activeMode =  '';
    if(popName== 'thank_you_popup'){
      this.selectedSlot= null;   
    }
    this.onClose.emit();
  }
  openPopup(mode)
  {
      this.activeMode='';
      this.error="";
      this.success="";
      this.speaker=null;
      this.speakerMeetingSlot = null;
      this.selectedSlot = null;
      this.selectedSpeaker=null;
      this.selectedSchedule=null;
      if(mode=='attend_popup')
      {
        this.loadViewerSchedule();
      }else
      {
        this.loadSpeakerSlot();
      }
      this.activeMode =  mode;
  }
  onSelectSlot(_selectedSlot)
  {   
    this.selectedSlot=_selectedSlot;
  }

  onSelectSchedule(_selectedSchedule)
  {
    if (!this.cannotJoin(_selectedSchedule.start_time)) {
      this.selectedSchedule = _selectedSchedule;
    }
  }

  showScheduleDetails()
  {
   
    this.speakerService.updateScheduleStatus(this.webcast.webcast_id,this.selectedSchedule.id).subscribe(
      x => {  
      if(x)
        {
         // console.log("updateMeeting status");
          console.log(x);            
        }
      });
    //this.activeMode='join_popup';
  }

  addViewerSpeakerMeeting()
  {   
    
      let speaker_id=this.selectedSlot.speaker_id;    
      let slot_id=this.selectedSlot.id;
      let num_day=this.selectedSlot.num_day;
      let start_time=this.selectedSlot.start_time;
      let end_time=this.selectedSlot.end_time;  
      
      start_time = this.datepipe.transform(start_time, 'yyyy-MM-dd H:mm:ss');
      end_time = this.datepipe.transform(end_time, 'yyyy-MM-dd H:mm:ss');

    this.speakerService.submitViewerSpeakerMeeting(this.webcast.webcast_id,speaker_id,slot_id,num_day,start_time,end_time).subscribe(data => {
        if (data.error) {
          //console.log(data.error.message);
          this.showError(data.error.message);
          this.speakerMeetingSlot =  this.speakerMeetingSlot.filter(x=> x.id != slot_id);
        } else {
          this.statsService.trackActivity(this.webcast.webcast_id,'schedule_meeting');  
          let msg = data?.success;
          this.resetLoading(msg);
          //console.log(msg);
        }
      },
        error => {
          this.showError(error);
        });
  }

  showError(message) {
    this.error = message;
    this.loading = false;  
  }
  setLoading() {
    this.error = "";
    this.loading = true;  
  }
  unsetLoading() {
    this.loading = false;
  }
  resetLoading(message) {
  
    this.activeMode='thank_you_popup';
    this.success = message;
    this.loading = false; 
    
  }

  cannotJoin(startTime): boolean {
    let dateNow = new Date().getTime();
    var startDateTime = new Date(startTime).getTime();
    //console.log(new Date(startTime));
    //console.log(dateNow);
    let timeDifference = startDateTime - dateNow;
    //console.log(timeDifference);
    let minutes = Math.floor((timeDifference) / (1000 * 60));
    console.log(minutes);
    if (minutes > 10)
      return true;
    return false;
  }

  cardAnimation(value) {
    //this.parentSubject.next(value);
  }

  toggleChat() {
    this.appStateService.showChat(!this.openChat);
  }


  hasWidget(name) {
    return this.webcastService.hasWidget(name);
  }

  //this.startTour(); call on button click
  startTour() {  
    let xTour: XTour = new XTour();
    xTour.tourId = "lobby-tour";
    xTour.useOrb = false;
    let xTourSteps: XTourSteps[] = [
      {
        "title": "",
        "content": "This feature connects you with everyone who shares your interests. To initiate a conversation, swipe right. To skip them, swipe left.",
        "selector": ".network_lounge_speed_netwroking",
        "orientation": "top-right"
      } ];
    
    xTour.steps = xTourSteps;
    xTour.completeCallback = ()=>this.openPopup('networking_popup');
    xTour.skipCallback = ()=>this.openPopup('networking_popup'); 
    //console.log(this.guidedTourService);

    this.guidedTourService.startTour(xTour);
    //console.log("tour inti");
  }
}
