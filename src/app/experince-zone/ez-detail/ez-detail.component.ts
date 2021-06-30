import { Component, OnInit, Input, SimpleChange, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { GALLERY_IMAGE } from 'ngx-image-gallery';
import { Stall } from '../../_models/room.model';
import { DomSanitizer } from '@angular/platform-browser';
import { WebcastService } from 'src/app/_services';
import { StatsService } from '../../_services/stats.service';
import { Stats } from '../../_models/user-stats.model';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-ez-detail',
  templateUrl: './ez-detail.component.html',
  styleUrls: ['./ez-detail.component.css']
})
export class EzDetailComponent implements OnInit {

  @Input() stall: Stall;
  @Input() expoBg: string = "";
  @Output() onStallClosed = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();
  @ViewChild('videoPlayer', { static: false }) videoPlayer: ElementRef;
  action = '';
  assets: [];
  gallery:any[]=[]; 
  products: [];
  bgimage="";
  website_url = "";
  facebook_link="";
  twitter_link="";
  instagram_link="";
  promo_video="";
  demo_video="";
  gallery_images:[];
  days: string[] = [];
  dayWiseImages: [] = [];
  currently_playing_video="";
  enableFullPageMode = false;
  show_chat_popup = false;
  webcast_id="";
  isMobile = false;
  forcePromoPause = false;
   // gallery images
  // images: GALLERY_IMAGE[];
  
  constructor(private sanitizer: DomSanitizer, private statsService: StatsService, private deviceManager: DeviceDetectorService) {
    if (this.deviceManager.isMobile() || this.deviceManager.isTablet()) {
      
      this.isMobile = true;
      console.log(this.isMobile);
    }
    else {
      this.isMobile = false;
      console.log(this.isMobile);
    }
  }

  ngOnInit(): void {
    if (this.stall && this.stall.assets) {
      console.log(this.stall);
      this.assets = JSON.parse(this.stall.assets)
      console.log(this.assets);
      console.log(this.assets['helpdesk_key']);
      if (this.assets["social_links"]) {
        this.website_url = this.assets["social_links"]["website_url"];
        this.facebook_link = this.assets["social_links"]["facebook_link"];
        this.twitter_link = this.assets["social_links"]["twitter_link"];
        this.instagram_link = this.assets["social_links"]["instagram_link"];
      }
      this.promo_video = this.assets["promo_video"]; 
      this.demo_video = this.assets["demo_video"];
      this.products = this.assets["products"];    
      this.gallery=this.stall.stall_gallery; 
      this.bgimage=this.assets["slider_image"];
      this.webcast_id=this.stall.webcast_id;

      console.log(this.webcast_id);
      if (this.videoPlayer) {
        setTimeout(() => {
          this.videoPlayer.nativeElement.muted = false;//"muted";
          this.videoPlayer.nativeElement.play().catch((err) => {
            console.log(err);
          });
        },1000);
      }
    
      this.statsService.trackActivity(this.webcast_id,'visit_stall',this.stall.id);

    }
  }
  enableSkip($event) {
    if (this.videoPlayer.nativeElement.currentTime > .2) {
      this.videoPlayer.nativeElement.muted = false;
    }
    
  }
  ngOnChanges(changes: SimpleChange) {
   
  }
  setForcePause(flag) {
    console.log(flag);
    this.forcePromoPause = flag;
  }
  open(action) {
    if (action == 'helpdesk_popup') {
      this.show_chat_popup = true;
      if (this.deviceManager.isMobile() || this.deviceManager.isTablet()) {
        this.enableFullPageMode = true;
      }
    }
    this.action = action;
    this.videoPlayer.nativeElement.pause();
  }
  closeStall() {
    this.action = '';
    this.onStallClosed.emit();
  }
  closePopups() {
    this.action = '';
    if (!this.forcePromoPause) {
      this.videoPlayer.nativeElement.play();
    }
  }

 closeModal() {
    this.onClose.emit();
  }
  resetCurrentVideo($video) {
    this.enableFullPageMode =true;
    this.currently_playing_video = $video + "?autoplay=1&mute=0";
    this.videoPlayer.nativeElement.pause();
  }
  closeVideoPopup() {
    this.enableFullPageMode = false;
    this.currently_playing_video = '';
    if (!this.forcePromoPause) {
      this.videoPlayer.nativeElement.play();
    }
    //this.galleryModalVideoPopup.nativeElement.modal("hide");;
  }
  closeHelpDeskPopup() {
    this.enableFullPageMode = false;
    this.show_chat_popup = false;
    this.action = '';
    if (!this.forcePromoPause) {
      this.videoPlayer.nativeElement.play();
    }
  }
  onfullPageVideo($event)
  {
    console.log('kanika');
    console.log($event);
    this.enableFullPageMode=$event;
  }
  getStatusClass() {
    return this.show_chat_popup === true ? 'show' : 'hide';
  }
  }
