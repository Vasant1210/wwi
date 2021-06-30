import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RoomService } from '../_services/room.service';
import { Stall } from '../_models/room.model';
import { WebcastService, AuthenticationService } from '../_services';
import { Webcast, User } from '../_models';
import { Router } from '@angular/router';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-experince-zone',
  templateUrl: './experince-zone.component.html',
  styleUrls: ['./experince-zone.component.css']
})
export class ExperinceZoneComponent implements OnInit {

  stalls: Stall[];
  expo:Stall[];
  selectedStall: Stall =null;
  expo_bgimage:string;
  webcast: Webcast;
  currentUser: User;
  loading: boolean= false;
  slideConfig = {
    "slidesToShow": 3,
    "slidesToScroll": 1,
    "dots": true,
    "infinite": true,
    "autoplay": false,
    "centerMode": true,
    "arrows": true,
    "speed": 900

  };
  
  constructor(private webcastService: WebcastService, private roomService: RoomService,
    private router: Router, private authenticationService: AuthenticationService, private spinner: NgxSpinnerService) {
      this.authenticationService.currentUser.subscribe(x => {
        this.currentUser = x
        if (this.currentUser && !this.currentUser.hasProfile) {
          this.router.navigate([`${this.currentUser.webcast_id}/profile`]);
        }
      });
     }

  ngOnInit(): void {
    this.webcastService.webcast.subscribe(x => {
      if (x) {
        this.webcast = x;
        this.loadStall();
      }
    });
    
  }

  slickInit(e) {
  }
  
  breakpoint(e) {
  }
  
  afterChange(e) {
  }
  
  beforeChange(e) {
  }

  loadStall() {
    this.loading = true;
    this.spinner.show();
    this.roomService.loadStalls(this.webcast.webcast_id).subscribe(x => {
      this.spinner.hide();
      if (x) {
        let expos = x.filter(y => y.room_type == 'expo');
        if (expos && expos.length > 0) {
        this.expo = expos;
          this.expo_bgimage = this.expo[0]["bgimage"];
        }
        let _stalls = x.filter(y => y.room_type == 'stall');
        if (_stalls.length == 2) {
          _stalls.push(_stalls[0]);
          _stalls.push(_stalls[1]);
        }
        if (_stalls.length == 3) {
          _stalls.push(_stalls[2]);
        }
        this.slideConfig.slidesToShow = _stalls.length == 1 ? 1 : 3;

        //this.slideConfig.slidesToShow = _stalls.length > 3 ? 3 : _stalls.length;
        console.log(_stalls.length);
        this.stalls = _stalls;
             
      }
      this.loading = false;

    });
    
  }
  openStall(stall) {
    this.selectedStall = stall;    
  }
  goToLobby()
  {
    this.router.navigate([`${this.webcast.webcast_id}/lobby`]);
  }
}
