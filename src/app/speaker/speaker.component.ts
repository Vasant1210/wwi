import { Component, OnInit } from '@angular/core';
import { WebcastService, AuthenticationService } from '../_services';
import { Webcast , User} from '../_models';
import { SpeakerService } from '../_services/speaker.service';
import { Speaker } from '../_models/speaker';
import { GoogleAnalyticsService, NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';

@Component({
  selector: 'app-speaker',
  templateUrl: './speaker.component.html',
  styleUrls: ['./speaker.component.css']
})
export class SpeakerComponent implements OnInit {
  webcast: Webcast;
  speakers: Speaker[];  
  currentUser: User;
  constructor(private authService: AuthenticationService, private speakerService: SpeakerService,private webcastService: WebcastService, private $gaService: GoogleAnalyticsService) { 
    this.authService.currentUser.subscribe(x => {
      this.currentUser = x
    });
  }

  ngOnInit(): void {
    this.webcastService.webcast.subscribe(x => {
      if (x) {
        this.webcast = x;
        if(this.currentUser)
        {
          this.$gaService.pageView(`/${this.webcast.webcast_id}/speaker`, `/${this.webcast.webcast_id}/speaker`, undefined, {
            user_id: this.currentUser.id            
          })       
        }else{
          this.$gaService.pageView(`/${this.webcast.webcast_id}/speaker`, `/${this.webcast.webcast_id}/speaker`)        
        }              
        this.loadSpeaker();
      }
    })
    this.speakerService.speaker.subscribe(x => {
      this.speakers = x
    });
  }

  loadSpeaker() {
    this.speakerService.loadSpeaker(this.webcast.webcast_id).subscribe(
      x => { this.speakers = x });
  }

  renderDefaultProfilePic(currentUser: Speaker) {
    if (currentUser && currentUser.spe_photo) {
      return currentUser.spe_photo;
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
      ctx.fillText(currentUser.spe_name.substr(0, 1), 50, 70);
      //ctx.fillText(currentUser.fullName.substr(0,1), 10, 50);
      return canvas.toDataURL("image/png");
    }
  }

}
