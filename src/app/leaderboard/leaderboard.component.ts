import { Component, OnInit } from '@angular/core';
import { Webcast, User } from '../_models';
import { Observable, Subject, Subscription } from 'rxjs';
import { WebcastService, AuthenticationService } from '../_services';
import { LeaderBoardDetails } from '../_models/leaderboard.model';
import { LeaderboardService } from '../_services/leaderboard.service';
import { StatsService } from '../_services/stats.service';
import { Stats } from '../_models/user-stats.model';
import { GoogleAnalyticsService, NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  webcast: Webcast;
  leaderboardMaster:LeaderBoardDetails;
  userStats:Stats[];
  currentUser: User;
  constructor(private webcastService: WebcastService,  private authService: AuthenticationService, private leaderboardService: LeaderboardService, private statsService: StatsService, private $gaService: GoogleAnalyticsService ) { }

  ngOnInit(): void {
    this.webcastService.webcast.subscribe(y=>
      {
        if(y)
        {
          this.webcast=y;
          if (this.authService.currentUserValue)
          {
            this.$gaService.pageView(`/${this.webcast.webcast_id}/leaderboard`, `/${this.webcast.webcast_id}/leaderboard`, undefined, {
              user_id: this.authService.currentUserValue.id            
            })       
          }else{
            this.$gaService.pageView(`/${this.webcast.webcast_id}/leaderboard`, `/${this.webcast.webcast_id}/leaderboard`)        
          }
         
          
          this.leaderboardService.loadDetails(this.webcast.webcast_id).subscribe(
            x=> {
              if(x)
              {
                this.leaderboardMaster=x;   
              }
            });
            this.leaderboardService.loadResult(this.webcast.webcast_id).subscribe(
              z=> {
                console.log("in compo1");
                if(z)
                {
                  this.userStats=z;
                }
            });
           
      }});
      
      if(this.webcast && this.webcast.webcast_id)
      {
        this.leaderboardService.loadResult(this.webcast.webcast_id).subscribe(
          z=> {
            if(z)
            {
              this.userStats=z;
            }
        });
      }
      
     
  }


}
