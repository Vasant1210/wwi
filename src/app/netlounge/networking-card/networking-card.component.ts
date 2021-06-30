import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { keyframes, style, animate, trigger, transition } from '@angular/animations';
import { CustomFormService } from '../../_services/custom-form.service';
import {ViewersProfile} from '../../_models/viewers-profile.model'
import { Webcast, } from '../../_models';
import { WebcastService, AuthenticationService, AppStateService } from '../../_services';


@Component({
  selector: 'app-networking-card',
  templateUrl: './networking-card.component.html',
  styleUrls: ['./networking-card.component.css'],
  animations: [
    trigger('cardAnimator', [
      transition('* => swiperight', animate(750, keyframes([
        style({ opacity: 1 }),
        style({ transform: 'translate3d(100%, 0, 0) rotate3d(0, 0, 1, 70deg)', opacity: 0 }),
      ]))),
      transition('* => swipeleft', animate(750, keyframes([
        style({ opacity: 1 }),
        style({ transform: 'translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -70deg)', opacity: 0 }),
      ])))
    ])
  ]
   
})

export class NetworkingCardComponent implements OnInit {
  webcast: Webcast;
  matchingProfiles:ViewersProfile[];
  allCoughtUp = false;
  @Output() onCloseSpeedNetworking = new EventEmitter<any>();
  @Output() onChat = new EventEmitter<number>(); 
  public index = 0;
  animationState: string = '';
  lastopenchatuserid = 0;
  constructor(private webcastService: WebcastService, private customFormService: CustomFormService, private appStateService: AppStateService) {

  }

  ngOnInit(): void {
    this.webcastService.webcast.subscribe(x => {
      if (x) {
        this.webcast = x;       
        this.customFormService.getMatchingProfile(x.webcast_id).subscribe(y => {
          if (y) {
            let matchingProfiles = y;
            let last = new ViewersProfile();
            last.viewer_id = 0;
            last.id = 0;
            last.profile = {
              'Full Name': 'All Caught Up', 'Designation': '', 'Company Name': '', 'Work Phone Number': '', 'Work Email Id': 'COME BACK LATER', 'profile_pic': './assets/images/ok.png'
            };
            matchingProfiles.push(last);
            matchingProfiles.push(last);
            this.matchingProfiles = matchingProfiles;
            console.log(matchingProfiles);
          } 
        });
        
      }
    });
  }
  startAnimation(state) {
    if (!this.animationState) {
      this.animationState = state;
      if (state == 'swiperight') {
        this.lastopenchatuserid = this.matchingProfiles[this.index].viewer_id;
        this.appStateService.openChatForUser(this.matchingProfiles[this.index].viewer_id);
      }
      if (state == 'swipeleft') {
        this.appStateService.showChat(false);
      }
    }
    
  }

  resetAnimationState(state) {
    if(this.index <  this.matchingProfiles.length){
      if(this.animationState != '')
      {
        this.index++;     
      }
    }
    this.animationState = '';
  }

  closeSpeedNetworking() {
    this.appStateService.closeChatForUser(this.lastopenchatuserid);
    this.appStateService.showChat(false);
    this.onCloseSpeedNetworking.emit();
    
  }
  openChat() {
    this.startAnimation("swiperight");
   
  }
  closeChat() {
    this.startAnimation("swipeleft")
   
  }
}
