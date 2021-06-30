import { Component, OnInit, HostListener, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Routes, RouterModule, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CformService, AuthenticationService, WebcastService } from '../app/_services';
import { Cform, User, Webcast, AppState} from '../app/_models';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { AppStateService } from './_services/app-state.service';
import { ThemeService } from './_services/theme.service';
import { Theme } from './_models/theme.model';
import { map, filter, mergeMap } from 'rxjs/operators';
/*import { CometChatService } from './_services/comet-chat.service';*/
import { io } from 'socket.io-client';
import { XEventSocketService } from './_services/x-event-socket.service';
import { HttpClient } from '@angular/common/http';
import { SocketIOAdapter } from './socketio-adapter';

import { RoomService } from './_services/room.service';
import { Room } from './_models/room.model';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BusinessCardService } from './_services/business-card.service';
import { StatsService } from './_services/stats.service';
import { Stats } from './_models/user-stats.model';
import { GoogleAnalyticsService, NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';
import { GuidedTourService, GuidedTourModule } from 'ngx-guided-tour';
import { Orientation, OrientationConfiguration, TourStep } from "ngx-guided-tour";

import { ChatAdapter } from './xchat/core/chat-adapter';
import { IChatController } from './xchat/core/chat-controller';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit,AfterViewInit {
  
  loading = false;
  currentUser: User;
  webcast_id: any;
  webcast: Webcast;
  rooms:Room[]=[];
  appState: AppState;
  enableFeedback = false;
  theme: Theme;
  data='';
  active = '';
  headerVisibilty = false;
  footerVisibilty = false;
  showWebsite = true;
  currentUrl = "";
  private socket: any;
  title = 'app';
  showMusic: boolean = true;
  userId: any;
  username: string;
  socketUsetId: string;
  public adapter: ChatAdapter;
  showChat: boolean = false;
  showChatAlert: boolean = false;
  profilePic = "";
  showExperiencZone=false;
  isMobile: boolean;

  @ViewChild('xChatInstance')
  protected xChatInstance: IChatController;
    
  constructor(private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private webcastService: WebcastService,
    public appStateService: AppStateService,
    private http: HttpClient,
    /*private cometChatService: CometChatService,*/
    private roomService: RoomService,
    private deviceService: DeviceDetectorService,
    public xEventSocketService: XEventSocketService,
    private businessCardService: BusinessCardService, private statsService: StatsService,private $gaService: GoogleAnalyticsService
  ) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x
      window.dispatchEvent(new Event('resize'));
     
    });
    this.webcastService.webcast.subscribe(x => {
      if (x) {
		
        this.webcast = x;
        this.theme = x.theme;
        /*this.cometChatService.init();*/
        if (this.currentUser && this.hasWidget('x_chat') && this.webcast.status  == 'live') {
          this.userId = this.currentUser.id;
          this.xEventSocketService.connect(this.webcast.webcast_id, this.currentUser);
        }
		
		var eventName=x.webcast_id;
	this.http.post<any>('https://admin.theliveevents.com/api/public/api/getmusic', { location: 'Lobby Page',event : eventName }).subscribe(data => {
        this.data = data.url;
		  console.log(data.url);
		  if(data.url==""){
		this.showMusic=false;
	}
    })
		
		
		
		
		
      }
    });
    this.authenticationService.currentUser.subscribe(x => {
      if (x) {
        this.currentUser = x
        this.renderDefaultProfilePic(x);
        window.dispatchEvent(new Event('resize'));
          this.getRooms();
        if (this.webcast && this.hasWidget('x_chat') && this.webcast.status == 'live') {
          this.userId = this.currentUser.id;
          this.xEventSocketService.connect(this.webcast.webcast_id, x);
        }
        /*if ((this.webcast && this.webcast.webcast_id) != this.currentUser.webcast_id) {
          this.logout();
        }*/
      }
      //this.xEventSocketService.connect();
    });
    this.isMobile = this.deviceService.isMobile();
	
   
  }
  ngOnInit() {
 
    this.headerFooter();    
    this.appStateService.appState.subscribe(x => {
      this.appState = x;
      if (x.showFeedback) {
        this.openFeedbackForm();
      }
      this.showChat = x.showChat;
      //console.log(this.showChat);
      if (this.appState.triggerCloseChatWindowUserId) {
        this.xChatInstance.triggerCloseChatWindow(this.appState.triggerCloseChatWindowUserId);
      }
      this.showChatAlert = x.globalChatAlert;
    })
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        if(this.currentUser)
        {
          this.$gaService.pageView(e.urlAfterRedirects, e.urlAfterRedirects, undefined, {
            user_id: this.currentUser.id            
          })         
        }else{
          this.$gaService.pageView(e.urlAfterRedirects, e.urlAfterRedirects)          
        }
        this.currentUrl = e.url;
        window.dispatchEvent(new Event('resize'));
      }
    });
	

    
  }
  ngAfterViewInit() {

    
  
  }
  
  logout() {
    if (this.currentUser) {
      this.webcast_id = this.currentUser.webcast_id;
      if(this.webcastService.hasWidget('x_chat') && this.webcast.status == 'live' &&  this.xEventSocketService.socketUsetId){
        this.xEventSocketService.leaveEvent(this.webcast_id, this.currentUser);
      }
      this.authenticationService.init_logout(this.currentUser).subscribe(
        result => {
          this.authenticationService.logout();
          this.router.navigate([`${this.webcast_id}`]).then(() => {
            window.location.reload();
          });;
        }
      );
    } else {
      this.authenticationService.logout();
      this.router.navigate([`${this.webcast_id}`]).then(() => {
        window.location.reload();
      });;
    }
  }
  @HostListener('window:beforeunload')
  unloadHandler(event) {
    //this.logout();
  }
  openFeedbackForm() {
    this.enableFeedback = true;
  }
  closeFeedbackForm() {
    this.enableFeedback = false;
    this.logout();

  }
  hasWidget(name) {
    return this.webcastService.hasWidget(name);
  }
  openModal(name) {
    //console.log(name);
    this.active = name;
  }

  headerFooter() {
    this.router.events.pipe(
      filter(events => events instanceof NavigationEnd),
      map(evt => this.route),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      })).pipe(
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      ).subscribe(x => {
        this.headerVisibilty = x.header;
        this.footerVisibilty = x.footer;
        
      })

  }
  goToLobby() {
    this.router.navigate([`${this.webcast.webcast_id}/profile/edit`]);
  }

  closePopup() {
    this.active = "";
    
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.currentUser) {
      if (event.target.innerHeight > event.target.innerWidth) {
        this.removeModalExtraBackdrops();
        if (this.currentUrl.indexOf('/profile') > -1)
          this.showWebsite = true;
        else
          this.showWebsite = false;
      } else {
        this.showWebsite = true;
      }
    }
  }
  public InitializeSocketListerners(): void {
    this.socket.on("generatedUserId", (userId) => {
      // Initializing the chat with the userId and the adapter with the socket instance
      //console.log(this.webcast.webcast_id);
      this.adapter = new SocketIOAdapter(userId, this.socket, this.http, this.webcast.webcast_id, this.businessCardService);
      //console.log(userId);
      this.socketUsetId = userId;
    });
 
  }
  public toggleChat() {
	  
	
    //this.showChat = !this.showChat;
    this.appStateService.showChat(!this.showChat)
    //this.showChatAlert = false;
    this.appStateService.setGlobalChatAlert(false);
  }
  public closeChat() {
    //this.showChat = false;
    this.appStateService.showChat(false)
    //this.showChatAlert = false;
    this.appStateService.setGlobalChatAlert(false);
  }
  showChatNotificationAlert() {
    //this.showChatAlert = true;
    this.appStateService.setGlobalChatAlert(true);
  }
removeModalExtraBackdrops()
{
  var eleBody = document.getElementsByTagName('body');
  if (eleBody && eleBody.length > 0) {
    eleBody.item(0).classList.remove("modal-open");
    var modalBackdrop = document.getElementsByClassName('modal-backdrop');
    if (modalBackdrop && modalBackdrop.length > 0) {
      for (var i = 0; i < modalBackdrop.length; i++) {
        modalBackdrop.item(i).remove();
      }
    }
  }
}
  renderDefaultProfilePic(currentUser: User) {
    if (currentUser && currentUser.profile && currentUser.profile.profile_pic) {
      this.profilePic = currentUser.profile.profile_pic;
    } else {
      let canvas: HTMLCanvasElement = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      let ctx: any = canvas.getContext("2d");
      ctx.fillStyle = "#004c3f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "60px Config";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText(currentUser.fullName.substr(0, 1), 50, 70);
      //ctx.fillText(currentUser.fullName.substr(0,1), 10, 50);
      this.profilePic = canvas.toDataURL("image/png");
    }
  }
  getRooms(){ 
      this.roomService.rooms.subscribe(
       x => {
        if (x) {                
          this.rooms = x.filter(x=> x.room_type=='main_event' ||  x.room_type == 'breakout_room');  
         }
      }
    );
    
  }
  goToRoom(room) {
    if(room.status == 'draft')
    return false;
    this.router.navigate([`${this.webcast.webcast_id}/home/${room.id}`]);
    
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    history.go(1);
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
  

  updateStatQminCafe() {
    //console.log("qc");
        this.statsService.trackActivity(this.webcast.webcast_id,'visit_qmin_cafe'); 
       // window.location.href="https://www.qmin.co.in/";
       // window.location..target="_blannk";
        window.open('https://www.qmin.co.in/', '_blank');
         
  }
}

