import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { TermsComponent } from './terms/terms.component';
//import { AwardsComponent } from './awards/awards.component';
import { LeaderboardComponent } from './leaderboard.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { RouterModule } from '@angular/router';
import { LbTermsComponent } from './lb-terms/lb-terms.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { LbPrizesComponent } from './lb-prizes/lb-prizes.component';
import { LbLevelsComponent } from './lb-levels/lb-levels.component';
import { LbPointsComponent } from './lb-points/lb-points.component';




@NgModule({
 
  imports: [
    CommonModule, 
    RouterModule,
    PerfectScrollbarModule
  ],
  exports: [LeaderboardComponent],
  declarations: [LbTermsComponent, LbPrizesComponent, LbLevelsComponent, LbPointsComponent]
  
})
export class LeaderboardModule { }
