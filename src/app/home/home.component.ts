import { Component, OnInit,OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { WebcastService, AuthenticationService, PollService, AppStateService } from '../_services';
import { Webcast, User } from '../_models';
import { RoomService } from '../_services/room.service';
import {  MainEvent } from '../_models/room.model';
import { ActivePoll } from '../_models/active-poll';
/*import { CometChatService } from '../_services/comet-chat.service';*/
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { StatsService } from '../_services/stats.service';
import { Stats } from '../_models/user-stats.model';
import videojs from 'video.js';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit,OnDestroy {

		
ngOnDestroy(){
	
	
	if(this.player != undefined){
			this.player.dispose();
	}
	
	
			}
  player;
  webcast: Webcast;
  currentUser: User;
  mainEvent: MainEvent;
  showOverlay=false;
  loading: false;
  showStream = false;
  allowSkip = false;
  showM3u=false;
  
  stream_url = "";
  entry_video = "";
  hasPoll = false;
  views:any[];

  selectedName:any;
  selectedUrl:any;
  selectedCamKey = '';
  selectedCamURL='';
  action = '';
  showPollAlert = false;
  openChat = false;
  activePoll: ActivePoll;
  room_id: number;
  showChatAlert: boolean = false;

  @ViewChild('videoPlayer', { static: false }) videoPlayer: ElementRef;
   
  constructor(private webcastService: WebcastService,
    private authenticationService: AuthenticationService,
    private roomService: RoomService,
    private pollService: PollService,
    /*private cometChatService: CometChatService,*/
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appStateService: AppStateService, 
    private statsService: StatsService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }
public videoJsConfigObj = {
            preload: "metadata",
            controls: true,
            autoplay: true,
            overrideNative: true,
            techOrder: ["html5"],
            html5: {
                nativeVideoTracks: false,
                nativeAudioTracks: false,
                nativeTextTracks: false,
                hls: {
                    withCredentials: false,
                    overrideNative: true,
                    debug: true
                }
					}
				};
  ngOnInit(): void {
    this.webcastService.webcast.subscribe(x => {
      if (x) {
        this.webcast = x;
        this.allowSkip = false;
        this.showStream = false;
        /*this.cometChatService.hideWidget();*/
        this.activatedRoute.params.subscribe(x => {
          if (x && x.roomId) {
            this.room_id=  x.roomId;            
          }
          this.loadMainRoom();
        });
        this.appStateService.appState.subscribe(x => {
          if (x) {
            this.showChatAlert = x.globalChatAlert;
          }
        });
      }
    });
	
	  setTimeout(() => {
	 const button = document.querySelector("#button");
	const audio = document.querySelector("audio");

	 audio.pause();
   (<HTMLInputElement>document.getElementById("button")).src= "/assets/images/Mute.svg";
	
	  });
	
  }

  loadMainRoom() {
	
    this.roomService.loadRooms(this.webcast.webcast_id).subscribe(x => {
      if (x) {
        /*this.cometChatService.hideWidget();*/
        if(this.room_id){
          this.mainEvent = x.find(r => r.id == this.room_id);  
          //call the trackActivity          
          this.statsService.trackActivity(this.webcast.webcast_id,'visit_room',this.room_id);
        }
        if(!this.mainEvent){
        this.mainEvent = x.find(r => r.room_type == "main_event");
        }
        if (this.mainEvent) {
          this.hasPoll = this.roomService.hasWidget(this.mainEvent.widgets, "poll");
          if (this.hasPoll) {
            this.loadPolls();
          }
        }
        if (this.mainEvent && this.mainEvent.assets) {
			
          let assets = JSON.parse(this.mainEvent.assets)
          this.entry_video = assets["entry_video"];
          this.stream_url = assets["main_url"];
          this.selectedCamURL = this.stream_url;
          this.views=assets["views"];  
          this.handleFlow();
		   setTimeout(() => {
		  var newex=this.stream_url.split('.').pop()
		   if(newex=="m3u8"){
			this.showM3u=true;
		var element = document.getElementById("my-video");
		element.classList.remove("hidden");
			 this.player = videojs('my-video', this.videoJsConfigObj);
			 	var elementx = document.getElementsByClassName("vjs-control-bar")[0];
			 elementx.setAttribute("style", "visibility:visible; bottom: 10%;background:#00000008");

			 }else{
			var element = document.getElementById("my-video");
			if(element!=undefined){
			element.classList.add("hidden"); 
			}
				 this.showM3u=false;
				 var elementx = document.getElementsByClassName("vjs-control-bar")[0];
				 if(elementx!=undefined){
			 elementx.setAttribute("style", "visibility:hidden;");
					}
			 }
		  
		   });
		  
        }
      }
    });
  }
  loadPolls() {
    this.pollService.loadPollFromDB(this.webcast.webcast_id, this.mainEvent.id);
    this.pollService.activePoll.subscribe(p => {
      if (p) {
        if (this.pollService.hasPollAlert(p, this.webcast.webcast_id, this.mainEvent.id, this.currentUser.id)) {
          this.showPollAlert = true;
        }
      }
    })
  }
  handleFlow() {
    if (this.entry_video) {
      this.showStream = false;
      this.videoPlayerPatch();
    } else {
      this.skipToStream();
    }
  }
  videoPlayerPatch() {
    setTimeout(() => {
      this.videoPlayer.nativeElement.muted = "muted";
      this.videoPlayer.nativeElement.play().catch((err) => {
      });
    });
  }
  showStreaming() {
    if ((this.videoPlayer.nativeElement.duration) == this.videoPlayer.nativeElement.currentTime) {
    // this.statsService.trackActivity(this.webcast.webcast_id,'complete_orientation');  
      this.skipToStream();
    } else if (this.videoPlayer.nativeElement.currentTime > 3) {
       this.allowSkip = true;
    }
  }

  onSelectVideo(key: string, url: string) {
    this.selectedCamKey = key;
    this.selectedCamURL = url;
	var newex=url.split('.').pop()
    this.stream_url=url; 
    console.log(this.selectedCamURL);   
    console.log(url);  
 setTimeout(() => {	
	 if(newex=="m3u8"){
		 this.showM3u=true;
		 var element = document.getElementById("my-video");
		 element.classList.remove("hidden");
		 this.player = videojs('my-video', this.videoJsConfigObj);
		 this.player.src({type: 'application/x-mpegURL', src: url });

		 this.player.play();
			var elementx = document.getElementsByClassName("vjs-control-bar")[0];
			 elementx.setAttribute("style", "visibility:visible; bottom: 10%;background:#00000008");
		 

	}else{	
	var element = document.getElementById("my-video");
		element.classList.add("hidden"); 
		this.showM3u=false;
		
		if(this.player != undefined){
			this.player.pause();
	}
		 	var elementx = document.getElementsByClassName("vjs-control-bar")[0];
			 elementx.setAttribute("style", "visibility:hidden;");
	    }
	 });
  }

  skipToStream() {
    this.showStream = true;
    this.allowSkip = false;
    /*this.cometChatService.showWidget();*/
  }

  openActionWindow($action) {
    if ($action == 'poll') {
      this.showPollAlert = false;
    }
    if(this.action == 'chat'){
      this.appStateService.showChat(false);

    }
    this.action = $action;
     this.showOverlay = true;
  }
  closeActionWindow() {
    this.action = '';
    this.showOverlay= false;
  }
  toggleChat() {
    this.action = 'chat';
    this.showOverlay = true;
    this.appStateService.showChat(!this.openChat);
  }
  hasWidget(name) {
    return this.webcastService.hasWidget(name);
  }
 
}
