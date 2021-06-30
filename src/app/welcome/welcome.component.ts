import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebcastService, AuthenticationService } from '../_services';
import { CustomFormService } from '../_services/custom-form.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CustomForm } from '../_models/custom-form';
import { Webcast, User } from '../_models';
import { StatsService } from '../_services/stats.service';
import { Stats } from '../_models/user-stats.model';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  cform: CustomForm;
  webcast: Webcast;
  currentUser: User;
  loading: false;
  allowSkip = false;

  @ViewChild('videoPlayer', { static: false }) videoPlayer: ElementRef;
 public data = [];
  showMusic: boolean = true;
  
  constructor(
	private route: ActivatedRoute,
	private http: HttpClient,
    private webcastService: WebcastService,
    private authenticationService: AuthenticationService,
    private customFormService: CustomFormService,
    private statsService: StatsService,
    private router: Router
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
	
  }

  ngOnInit(): void {
    this.webcastService.webcast.subscribe(x => {
      if (x) {
        this.webcast = x
        setTimeout(() => {
          this.videoPlayer.nativeElement.muted = "muted";
          this.videoPlayer.nativeElement.play().catch((err) => {
          });
      });
      }
    });

	var eventName=this.route.snapshot.params.webcast_id;
	this.http.post<any>('https://admin.theliveevents.com/api/public/api/getmusic', { location: 'Welcome Page',event : eventName }).subscribe(data => {
        this.data = data.url;
		  console.log(data.url);
		  if(data.url==""){
		this.showMusic=false;
	}
    })
	
	 
  }
  

  enableSkip($event) {
    if (this.videoPlayer.nativeElement.currentTime > 3) {
      this.allowSkip = true;
    }
    if (this.videoPlayer.nativeElement.duration == this.videoPlayer.nativeElement.currentTime) {
      this.statsService.trackActivity(this.webcast.webcast_id, 'complete_orientation');
      this.webcastService.redirectToHome();
    }
  }
  onvideomusic(){
  setTimeout(() => {

let vid = <HTMLVideoElement>document.getElementById('videoPlayer');

if(vid.muted){
		vid.muted = false;
		(<HTMLInputElement>document.getElementById("vidbutton")).src= "/assets/images/UnMute.svg";
	} else {
		vid.muted = true;
		(<HTMLInputElement>document.getElementById("vidbutton")).src= "/assets/images/Mute.svg";
	}
	 });
  }
  onmusic(){
	   setTimeout(() => {
	 const button = document.querySelector("#button");
	const audio = document.querySelector("audio");

	
  if (audio.paused) {
    audio.volume = 0.2;
    audio.play();
  (<HTMLInputElement>document.getElementById("button")).src= "/assets/images/Mute.svg";

    
  } else {
    audio.pause();
  (<HTMLInputElement>document.getElementById("button")).src= "/assets/images/UnMute.svg";
  }
  button.classList.add("fade");
});

 }
 
}
