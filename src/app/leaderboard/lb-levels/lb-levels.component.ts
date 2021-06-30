import { Component, OnInit, Input } from '@angular/core';
import { Stats } from '../../_models/user-stats.model';
import { LeaderBoardDetails } from '../../_models/leaderboard.model';
import { AuthenticationService, WebcastService } from 'src/app/_services';
import { User, Webcast } from '../../_models';

@Component({
  selector: 'app-lb-levels',
  templateUrl: './lb-levels.component.html',
  styleUrls: ['./lb-levels.component.css']
})
export class LbLevelsComponent implements OnInit {
  @Input() userStats:Stats[]; 
  @Input() gradeSystem:any[];
  user:User;
  current_user_id:string;

  constructor( private authenticationService: AuthenticationService) { 

    this.authenticationService.currentUser.subscribe(x=>{
      
      if (x)
      {
        this.user = x;
        this.current_user_id =  this.user.id.toString();
        console.log(this.current_user_id);
      }
    });
  
  }

  ngOnInit(): void {  
    console.log('lb-levels');
    console.log(this.userStats); 
    console.log(this.gradeSystem);
  }
  getUserGrade(score)
  {
    console.log(score);
    console.log(this.gradeSystem);
    let gs = this.gradeSystem.find(x=> x.min_range <= score && x.max_range >= score)
   console.log(gs);
    if(gs){
    return gs.grade;
    }
    return "";
  }
}
