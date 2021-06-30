import { Component, OnInit } from '@angular/core';
import { WebcastService, AuthenticationService } from '../_services';
import { Webcast, User} from '../_models';
import { StatsService } from '../_services/stats.service';
import { Stats } from '../_models/user-stats.model';
import { RoomService } from '../_services/room.service';
import { Room } from '../_models/room.model';
import { GoogleAnalyticsService, NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';

@Component({
  selector: 'app-socialwall',
  templateUrl: './socialwall.component.html',
  styleUrls: ['./socialwall.component.css']
})
export class SocialwallComponent implements OnInit {
  webcast: Webcast;
  feedURL = '';
  feedTitle='';
  currentUser: User;
  webcastId = "";
  constructor(private authService: AuthenticationService, private statsService: StatsService, private roomService: RoomService, private $gaService: GoogleAnalyticsService) {
  }
  ngOnInit(): void {
    if (this.authService.currentUserValue) {
      this.webcastId = this.authService.currentUserValue.webcast_id;
      this.loadData();
      this.trackActivity(this.webcastId);
      this.trackGA(this.webcastId);
    } 
  }
  loadData() {
    console.log("room is loaded");
    this.roomService.loadRoomByType(this.webcastId, 'social_wall').subscribe(x => {
      if (x) {
        if (x.assets) {
          let assets = JSON.parse(x.assets)
          this.feedURL=  assets["feed_url"]; 
          this.feedTitle=  assets["feed_title"]; 
        }                
      } 
    });
    //this.feedURL = ""; //"https://www.juicer.io/api/feeds/" + this.webcast?.detail?.event_social_tag + "/iframe";
  }
  trackGA(webcastId:string) {
    this.$gaService.pageView(`/${webcastId}/socialwall`, `/${webcastId}/socialwall`, undefined, {
      user_id: this.authService.currentUserValue.id
    })
  }
  trackActivity(webcastId: string) {
    this.statsService.trackActivity(webcastId, 'view_social_wall');  
  }
}
