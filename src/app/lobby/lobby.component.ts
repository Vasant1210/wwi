import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebcastService, AuthenticationService} from '../_services';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Webcast, User, AppState } from '../_models';
import { RoomService } from '../_services/room.service';
import { Lobby, MainEvent } from '../_models/room.model';
/*import { CometChatService } from '../_services/comet-chat.service';*/
import { GuidedTourService, ProgressIndicatorLocation } from 'ngx-guided-tour';
import { XTour, XTourSteps } from '../_models/guided-tour';
import { Guid } from '../xchat/core/guid';
@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  tawkicon:boolean =false;
  webcast: Webcast;
  currentUser: User;
  loading: boolean = false;
  lobby: Lobby;
  mainEvent: MainEvent;
  assets: [];
  agendaImage = "";
  tv1_video="";
  tv2_video="";
  door1_room="";
  door2_room = "";
  tourMode = false;
  active = ""; 
  appState: AppState = new AppState();
  error = "";
  enableTour = true;
  showTourChatOpen = false;
  @ViewChild('lobbyVideoPlayer1', { static: false }) lobbyVideoPlayer1: ElementRef;
  @ViewChild('lobbyVideoPlayer2', { static: false }) lobbyVideoPlayer2: ElementRef;
  @ViewChild('guidedtourChatBox', { static: false }) guidedtourChatBox: ElementRef;
  @ViewChild('guidedtourChatBoxBtn', { static: false }) guidedtourChatBoxBtn: ElementRef;
 public data = [];
  showMusic: boolean = true;
  constructor(
  private http: HttpClient,
  private webcastService: WebcastService,
  private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private roomService: RoomService,
    private router: Router,public guidedTourService: GuidedTourService
    //,private cometChatService: CometChatService
  ) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x
      if (this.currentUser && !this.currentUser.hasProfile) {
        this.router.navigate([`${this.currentUser.webcast_id}/profile`]);
      }
    });
     //new call

	

//endcall	 
  }
  get ProgressIndicatorLocation() {
    return ProgressIndicatorLocation;
  }
  ngOnInit(): void {

    this.webcastService.webcast.subscribe(x => {
      if (x) {
        if (this.currentUser && this.currentUser.hasProfile) {
          console.log(this.currentUser);
          this.webcast = x;
          this.loadLobby();
          this.getRoom();          
        } else {
          this.router.navigate([`${this.currentUser.webcast_id}/profile`]);
        }
      }
    });
	
	var eventName=this.route.snapshot.params.webcast_id;
	this.http.post<any>('https://api.tajvip.in/api/getmusic', { location: 'Lobby Page',event : eventName }).subscribe(data => {
        this.data = data.url;
		  console.log(data.url);
		  if(data.url==""){
		this.showMusic=false;
	}
    })
	
  }

  loadLobby() {
    
    let room_exists;
    if (this.roomService._rooms && this.roomService._rooms.value) {
      room_exists = this.roomService._rooms.value.find(x => x.room_type == "lobby")
    }
    if (!room_exists) {
      this.loading = true;
      this.roomService.loadRooms(this.webcast.webcast_id).subscribe(x => {
        this.loading = false;
        
      });
    }
  }

  startTour() {
    let xTour: XTour = new XTour();
    xTour.tourId = "lobby-tour";
    xTour.useOrb = false;
    let chatStep: XTourSteps = new XTourSteps();
    chatStep.action = () => this.showGuidedTourChatOpen();
    chatStep.title = "Business Card";
    chatStep.content = "Exchange business cards.";
    chatStep.selector = ".guidedtour-chat-box-btn";
    chatStep.orientation = "top-right";

    let xTourSteps: XTourSteps[] = [
      {
        "title": "Main Menu",
        "content": "Click here to browse through all that the event has to offer.",
        "selector": ".main_header_main_menu",
        "orientation": "bottom-right"
      },
      {
        "title": "Notifications",
        "content": "To see your notifications, click on the bell icon.",
        "selector": ".main_header_notifications",
        "orientation": "bottom-right"
      },
      {
        "title": "Lobby",
        "content": "To navigate back to the lobby at any time, click on the home icon.",
        "selector": ".main_header_lobbylink",
        "orientation": "bottom-right"
      },
      {
        "title": "Session Halls",
        "content": "To navigate between halls and breakout rooms, click on this icon.",
        "selector": ".main_header_extrarooms",
        "orientation": "bottom-right"
      }];
    if (this.lobby && this.door1_room == '1') {
      xTourSteps.push({
        "title": "Main Hall",
        "content": "To attend an ongoing session, click on the door.",
        "selector": ".tour-lobby-door-1",
        "orientation": "top-left"
      });
    }
    xTourSteps.push({
      "title": "Helpdesk",
      "content": "Need assistance? Our executive is happy to help. Click on the icon to contact the Help Desk.",
      "selector": ".lobby-helpdesk",
      "orientation": "top-right"
    });
    if (this.lobby && this.door2_room == '1') {
      xTourSteps.push({
        "title": "Main Hall",
        "content": "To attend an ongoing session, click on the door.",
        "selector": ".tour-lobby-door-2",
        "orientation": "top-right"
      });
    }
      xTourSteps.push({
          "title": "Agenda",
          "content": "Browse through the agenda to ensure that you don't miss sessions you are keen to attend.",
          "selector": ".loby-image-link",
          "orientation": "top-right"
        });
   
    
    if (this.webcastService.hasWidget('experience_zone')) {
      xTourSteps.push({
        "title": "Experience Zone",
        "content": "Participating partners invite you to experience their showcase of what they have to offer. Be sure to visit their booths!",
        "selector": ".main_footer_expo",
        "orientation": "top-left"
      })
    };
    if (this.webcastService.hasWidget('networking_lounge')) {
      xTourSteps.push(
        {
          "title": "Networking Lounge",
          "content": "This is where you can set up meetings and network with key participants at the event. If you're looking to interact with others who share your interests, check out the 'Speed Networking' feature.",
          "selector": ".main_footer_lounge",
          "orientation": "top-left"
        });
    };
    xTourSteps.push(
      {
        "title": "Digital Briefcase",
        "content": "This is where your files and downloads from across the event are saved for quick access any time.",
        "selector": ".main_footer_briefcase",
        "orientation": "top-left"
      });
    if (this.webcastService.hasWidget('social_wall')) {
      xTourSteps.push(
        {
          "title": "Social Wall",
          "content": "Stay connected to what people are saying about the event on social media.",
          "selector": ".main_footer_social",
          "orientation": "top-left"
        });
    };
    xTourSteps.push({
      "title": "Gallery",
      "content": "Check out all photographs and videos from the event. You may just spot yourself!",
      "selector": ".main_footer_gallery",
      "orientation": "top-right",
    });
    xTourSteps.push(
      {
        "title": "Qmin Cafe",
        "content": "Now you can enjoy Taj's curated fine-dining experience from the comfort of your home. Order a gourmet meal from an exclusive selection of restaurants.",
        "selector": ".main_footer_qumin",
        "orientation": "top-right"
      });
    if (this.webcastService.hasWidget('x_chat')) {
      xTourSteps.push({
        "title": "Chat",
        "content": "Connect with fellow attendees during the event and even exchange business cards",
         "selector": ".main_footer_chat",
        "orientation": "top-right"

      });
      xTourSteps.push(chatStep);
    }
    
    xTour.steps = xTourSteps;
    xTour.completeCallback = ()=>this.storeGuidedTourFlag();
    xTour.skipCallback = ()=>this.storeGuidedTourFlag(); 
    //console.log(this.guidedTourService);

    this.guidedTourService.startTour(xTour);
    //console.log("tour inti");
  }
  showGuidedTourChatOpen() {
    this.showTourChatOpen = true;
  }
  storeGuidedTourFlag() {
    this.tourMode = false;
    localStorage.setItem(this.currentUser.webcast_id + this.currentUser.id +"guidedtourtaken","true");
  }
  hasTakenTour() {
    let item = localStorage.getItem(this.currentUser.webcast_id + this.currentUser.id + "guidedtourtaken");
    if (item) { this.enableTour = false; return true };
    this.enableTour = true;
    return false;
  }
  getRoom() {
    this.roomService.rooms.subscribe(x => {
      if (x) {
        //console.log(x);
          this.lobby = x.find(r => r.room_type == "lobby");
        this.mainEvent = x.find(r => r.room_type == "main_event");
        
        if (this.lobby && this.lobby.assets) {         
            this.assets = JSON.parse(this.lobby.assets)
          this.agendaImage = this.assets["ajenda_image"];
          this.tv1_video = this.assets["tv1_video"];
          this.tv2_video = this.assets["tv2_video"];
          this.door1_room=this.assets["door1_room"];         
          this.door2_room=this.assets["door2_room"];          
          //this.cometChatService.showWidget();
          if (!this.hasTakenTour()) {
            this.tourMode = true;
            this.startTour();
          } else {
            setTimeout(() => {
              if (this.tv1_video) {
                this.lobbyVideoPlayer1.nativeElement.muted = "muted";
                this.lobbyVideoPlayer1.nativeElement.muted = true;
                this.lobbyVideoPlayer1.nativeElement.play().catch((err) => {
                });
              }
              if (this.tv2_video) {
                this.lobbyVideoPlayer2.nativeElement.muted = "muted";
                this.lobbyVideoPlayer1.nativeElement.muted = true;
                this.lobbyVideoPlayer2.nativeElement.play().catch((err) => {
                });
              }
            });
          }
          }
        }
      }
    );
  }
 onmusic(){
	 const button = document.querySelector("#button");
	const audio = document.querySelector("audio");


	
  if (audio.paused) {
    audio.volume = 0.2;
    audio.play();
   (<HTMLInputElement>document.getElementById("button")).src= "/assets/images/UnMute.svg";

    
  } else {
    audio.pause();
   (<HTMLInputElement>document.getElementById("button")).src= "/assets/images/Mute.svg";
  }
  button.classList.add("fade");

 }
  openAgenda() {
    this.active = 'agenda';
  }

  goToMainRoom() {
   
    if (this.mainEvent && (this.mainEvent.status == 'publish' || this.mainEvent.status == 'live')) {
      this.error = "";
      this.router.navigate([`${this.webcast.webcast_id}/home`]);
    } else {
      this.error = "We will be live soon";
    }
  }

  onclosePopup() {
    this.error = "";
  }

}
