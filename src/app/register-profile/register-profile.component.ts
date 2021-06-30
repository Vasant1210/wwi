import { Component, OnInit } from '@angular/core';
import { WebcastService, AuthenticationService } from '../_services';
import { CustomForm } from '../_models/custom-form';
import { Webcast, User } from '../_models';
import { FormGroup } from '@angular/forms';
import { Theme } from '../_models/theme.model';
import { XEventSocketService } from '../_services/x-event-socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-profile',
  templateUrl: './register-profile.component.html',
  styleUrls: ['./register-profile.component.css']
})
export class RegisterProfileComponent implements OnInit {
  cform: CustomForm;
  webcast: Webcast;
  currentUser: User;
  theme: Theme;
  constructor(
    private webcastService: WebcastService,
    private router: Router,
    private xeventchatService: XEventSocketService,
    private authenticationService: AuthenticationService) {
      this.webcastService.webcast.subscribe(x => {
        if (x) {
          this.webcast = x;
          this.theme = x.theme;
        }
      });
    
  }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe(x => {
      
      if(x){
        this.currentUser = x;
        if(this.currentUser.hasProfile)
        {
          this.router.navigate([`${this.currentUser.webcast_id}/lobby`]);
        }
      }
    });
  }

  onSubmitSucess()
  {
    if (this.webcast.status != "live") {
      this.authenticationService.logout();
      this.router.navigate([`${this.webcast.webcast_id}`]);
    } else {
      if (this.webcast) {
        if (this.currentUser && this.currentUser.hasProfile) {
          this.xeventchatService.joinEvent(this.currentUser.webcast_id, this.currentUser);
          }
        if (this.webcast && this.webcast.detail && this.webcast.detail.ornt_video) {
            this.router.navigate([`${this.webcast.webcast_id}/welcome`]);
        } else {
            this.router.navigate([`${this.webcast.webcast_id}/lobby`]);
          }
        }
      
    }
  }
  
}
