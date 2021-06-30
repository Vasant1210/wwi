import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AppStateService, AuthenticationService, CformService, WebcastService } from '../../app/_services';
import { User, Cform, Webcast, AppState } from '../_models';
import { ThemeService } from '../_services/theme.service';
import { Theme } from '../_models/theme.model';
import { SimpleSmoothScrollService } from 'ng2-simple-smooth-scroll';
import { SimpleSmoothScrollOption } from 'ng2-simple-smooth-scroll';



@Component({
  templateUrl: 'landing.component.html',
  styleUrls: ['landing.component.scss']
})

export class LandingComponent implements OnInit {
  loading = false;
  activeMode = "timer";
	showWebsite = true;
  currentUser: User;
  webcast: Webcast;
  theme: Theme;
  showMenu: boolean = true;

  @ViewChild('aboutUs', { static: false }) aboutUs: ElementRef;
  @ViewChild('videoPlayer', { static: false }) videoPlayer: ElementRef;
  public data = [];
  showMusic: boolean = true;
  constructor(private http: HttpClient,private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private webcastService: WebcastService,
    private smooth: SimpleSmoothScrollService
  ) {
    this.loading = true;
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
	
	
  }
  
  ngOnInit() {
    this.webcastService.webcast.subscribe(x => {
      if (x) {
        this.checkGate(x);
        this.theme = x.theme;
        this.webcast = x;
        this.initActiveMode();
        if (this.videoPlayer) {
          setTimeout(() => {
            this.videoPlayer.nativeElement.muted = "muted";
            this.videoPlayer.nativeElement.play().catch((err) => {
              console.log(err);
            });
          });
        }
        this.loading = false;
      }
    });
   //ambient music
   var eventName=this.route.snapshot.params.webcast_id;
      
   this.http.post<any>('https://admin.theliveevents.com/api/public/api/getmusic', { location: 'Landing Page',event : eventName}).subscribe(data => {
	 
        this.data = data.url;
		  console.log(data.url);
		  if(data.url==""){
		this.showMusic=false;
	}
    })
	
	 // setTimeout(() => {
	// var iFrame = document.getElementById('iFrame');
	// console.log("igra"+iFrame);
    // iFrame.width  = "100%";
    // iFrame.height = "1800px";
	// });
	
	
  }
  
 
  initActiveMode() {
    if (this.webcast && this.activeMode == "") {
      switch (this.webcast.status) {
        case "publish":
          this.setActiveMode("timer");
          break;
        default:
          this.setActiveMode("login");
      }
    }
  }

  checkGate(x) {
    
    if (this.authenticationService.currentUserValue) {
      if (x) {
        if (this.authenticationService.currentUserValue.webcast_id != x.webcast_id) {
          this.authenticationService.logout();
        } else {
          if (this.authenticationService.currentUserValue.hasProfile) {
            this.router.navigate([`${x.webcast_id}/lobby`]);
          } else {
            this.router.navigate([`${x.webcast_id}/profile`]);
          }
          
        }
      }
    }
  }
 
  

  setActiveMode(mode) {
      switch (mode) {
        case "login":
        case "register":
          this.showMenu = false;
          break;
        default:
          this.showMenu = true;
          break;
    }
    this.activeMode = mode;
  }
  scrollToAboutUs() {
    this.smooth.smoothScrollToTop({ duration: 1000, easing: 'linear' });
    //this.aboutUs.nativeElement.scrollIntoView({ behavior: 'smooth', block: "start"  });
  }
  
 onmusic(){
setTimeout(() => {

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
});
  
 } 
  
    
  
  

}
