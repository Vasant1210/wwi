import { Component, OnInit } from '@angular/core';
import { CformService, AuthenticationService, WebcastService } from '../_services';
import { Webcast, Cform } from '../_models';
import { timer, Subscription, interval } from 'rxjs';
import { Theme } from '../_models/theme.model';
import { ThemeService } from '../_services/theme.service';
@Component({
  selector: 'app-landing-timer',
  templateUrl: './landing-timer.component.html',
  styleUrls: ['./landing-timer.component.css']
})
export class LandingTimerComponent implements OnInit {

  webcast: Webcast;
  cform: Cform;
  theme_background = { "background": "#3490dc", "border-color": "#3490dc" };
  theme_color = "#3490dc";

  private subscription: Subscription;

  dateNow = new Date();
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;
  timeDifference;
  secondsToDday;
  minutesToDday;
  hoursToDday;
  daysToDday;
  showTimer = true;
  theme: Theme;
  startDate: any = new Date();
  endDate: any = new Date();
  constructor(private cformService: CformService,
    private authService: AuthenticationService,
    private webcastService: WebcastService,
    private themeService: ThemeService
  ) {
    this.themeService.theme.subscribe(x => this.theme = x);
  }

  ngOnInit(): void {
    this.webcastService.webcast.subscribe(x => {
      this.webcast = x
      if (x) {
        this.startDate = new Date(x.start_datetime,);
        this.endDate = new Date(x.end_datetime);
        if (this.webcast.status == 'publish') {
          if (this.hasTimeUnits()) {
            this.subscription = interval(1000)
              .subscribe(x => { this.getTimeDifference(); });
          } else {
            this.showTimer = false;
            //this.subscription = interval(60000)
            //  .subscribe(x => { this.getTimeDifference(); });
          }
        }else if (this.webcast.status == 'end') {
          this.showTimer = false;
        } else {
          this.showTimer = false;
        }
      }
      
     
    });
    this.cformService.cform.subscribe(x => {
      if (x) {
        this.cform = x;
        this.theme_background = this.cformService.getThemeBackgroundStyle();
        this.theme_color = this.cformService.getThemeColor();
      }
    });
  }

  private getTimeDifference() {
    var startDate = new Date(this.webcast.start_datetime).getTime();
    var endDate = new Date().getTime();
    //console.log(startDate);
    //console.log(endDate);
    this.timeDifference = startDate - endDate;
    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits(timeDifference) {
    this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
    this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
    this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
    this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
    if (this.secondsToDday <= 0 && this.minutesToDday <= 0 && this.hoursToDday <= 0 && this.daysToDday <= 0) {
      this.subscription.unsubscribe();
      this.secondsToDday = this.minutesToDday = this.hoursToDday = this.daysToDday = 0;
      window.location.reload();
      this.showTimer = false;
    }
  }
  private hasTimeUnits() {
    var startDate = new Date(this.webcast.start_datetime).getTime();
    var endDate = new Date().getTime();
    //console.log(startDate);
    //console.log(endDate);
    let timeDifference = startDate - endDate;
    this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
    this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
    this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
    this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
    if (this.secondsToDday <= 0 && this.minutesToDday <= 0 && this.hoursToDday <= 0 && this.daysToDday <= 0) {
      return false;
    }
    return true;
  }
  getSuffix(day) {
    if (day == 1) {
      return 'st';
    }
    if (day == 2) {
      return 'nd';
    }
    if (day == 3) {
      return 'rd';
    }
    return 'th';
  }
  ngOnDestroy() {
    //this.subscription.unsubscribe();
  }
}
