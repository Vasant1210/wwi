import { Component, Input, OnInit } from '@angular/core';
import { Webcast } from '../../_models';
import { Observable, Subject, Subscription } from 'rxjs';
import { WebcastService, AuthenticationService } from '../../_services';
import { LeaderboardService } from '../../_services/leaderboard.service';
import { CustomFormService} from '../../_services/custom-form.service';
import { CustomForm, FormField} from '../../_models/custom-form';
import { StatsService } from '../../_services/stats.service';

@Component({
  selector: 'app-lb-points',
  templateUrl: './lb-points.component.html',
  styleUrls: ['./lb-points.component.css']
})
export class LbPointsComponent implements OnInit {
  webcast: Webcast;
  cForm: CustomForm;
  pointsystem: FormField[];
  @Input() gradeSystem:any[];
  constructor(private webcastService: WebcastService,  private authService: AuthenticationService, private leaderboardService: LeaderboardService, private statsService: StatsService, private customFormService: CustomFormService) { }

  ngOnInit(): void {

    this.webcastService.webcast.subscribe(y=>
      {
        if(y)
        {
          this.webcast=y;
            this.customFormService.getFormByFormName(this.webcast.webcast_id,'leaderboard_ps_form').subscribe(
              z=> {
                if(z)
                {                  
                  this.cForm = z;
                  if(this.cForm)
                  {
                     this.pointsystem =  this.cForm.fields.filter(x => x.value > 0);
                  }
                  console.log(z);                
                }
              });
        }
      });      
    
  }

}
