import { Component, OnInit, ViewChild, EventEmitter, Output, ElementRef, ChangeDetectorRef} from '@angular/core';
import { Observable } from 'rxjs';
import { Webcast, User } from '../_models';
import { WebcastService, AuthenticationService } from '../_services';
import { GalleryService } from '../_services/gallery.service';
import { Emedia } from '../_models/emedia';
import { NgxImageGalleryComponent, GALLERY_IMAGE, GALLERY_CONF } from "ngx-image-gallery";
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { StatsService } from '../_services/stats.service';
import { Stats } from '../_models/user-stats.model';
import { GoogleAnalyticsService, NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  @ViewChild(NgxImageGalleryComponent,{ static: false }) ngxImageGallery: NgxImageGalleryComponent;
  @ViewChild('galleryModalVideoPopup') galleryModalVideoPopup: ElementRef;
  //@ViewChild('modalCloseButton') modalCloseButton;
  @Output() onClose = new EventEmitter<any>();
  emedia: Emedia[];
  webcast: Webcast;
  currentUser: User;
  currently_playing_video = "";
  days: string[] = [];
  dayWiseImages: [] = [];
  dayWiseVideos: [] = [];
  loading = false;
 conf: GALLERY_CONF = {
  imageOffset: '0px',
  showDeleteControl: false,
   showImageTitle: false,
   showThumbnails: false,
};
 // gallery images
  images: GALLERY_IMAGE[];

  constructor(private galleryService: GalleryService, private webcastService: WebcastService, private authService: AuthenticationService,
    private changeDetectorRefs: ChangeDetectorRef, private statsService: StatsService, private $gaService: GoogleAnalyticsService) {
    this.webcastService.webcast.subscribe(x => {
      this.webcast = x
    });
    this.authService.currentUser.subscribe(x => {
      this.currentUser = x
    });
  }

  ngOnInit() {
    if(this.currentUser)
      {
      this.$gaService.pageView(`/${this.webcast.webcast_id}/gallery`, `/${this.webcast.webcast_id}/gallery`, undefined, {
          user_id: this.currentUser.id            
        })       
      }else{
      this.$gaService.pageView(`/${this.webcast.webcast_id}/gallery`, `/${this.webcast.webcast_id}/gallery`)        
      }

    this.loading = true;
    this.galleryService.load(this.webcast.webcast_id, this.webcast.id).subscribe(x => {
      this.emedia = x;
      this.loading = false;
      if (x) {
        const _days = [...new Set(x.map(item => item.filter))];
        if (_days.length > 0) {
          this.days = _days;
          _days.forEach(function (obj) {
            this.dayWiseImages[obj] = this.populateImages(obj);
            this.dayWiseVideos[obj] = this.populateVideos(obj);
          }, this);
          this.refreshGallery(_days[0]);
          
        }
      }
    });;

    this.statsService.trackActivity(this.webcast.webcast_id,'view_gallery');  

  }
  // METHODS
  // open gallery
  galleryOpened(dayName, index: number = 0) {
  }
  openGallery(dayName, index: number = 0) {
    this.ngxImageGallery.images = this.dayWiseImages[dayName];
    //this.images = this.images.concat(this.dayWiseImages[dayName]);
    this.ngxImageGallery.open(index);
  }
    
  // close gallery
  closeGallery() {
    //this.images = [];
    this.ngxImageGallery.close();
  }

  // callback on gallery closed
  galleryClosed() {
    this.ngxImageGallery.images = [];

  }

  // set new active(visible) image in gallery
  newImage(index: number = 0) {
    this.ngxImageGallery.setActiveImage(index);
  }
    
  // next image in gallery
  nextImage(index: number = 0) {
    this.ngxImageGallery.next();
  }
    
  // prev image in gallery
  prevImage(index: number = 0) {
    this.ngxImageGallery.prev();
  }
  
  populateImages(dayName) {

    let _images = this.emedia.filter(y => y.type == 'image' && y.filter == dayName);
    let dayImages: any[] = [];
    for (let i = 0; i < _images.length; i++) {
      let obj: GALLERY_IMAGE = {
        url: _images[i].file_name,
        thumbnailUrl: _images[i].thumbnail,
      }
      dayImages.push(obj);
    }
    return dayImages;
  }

  populateVideos(dayName) {
    return this.emedia.filter(y => y.type == 'video' && y.filter == dayName);
  }
  refreshGallery(dayName) {
    this.images = this.images;
    this.images = this.dayWiseImages[dayName];
  }
  closeModal() {
    //this.modalCloseButton.nativeElement.click();
    //this.removeModalExtraBackdrops();
    this.onClose.emit();
  }
  resetCurrentVideo($video) {
    this.currently_playing_video = $video;
    
  }
  closeVideoPopup() {
    this.currently_playing_video = '';
    //this.removeModalExtraBackdrops();
  }
  removeModalExtraBackdrops() {
    var eleBody = document.getElementsByTagName('body');
    if (eleBody && eleBody.length > 0) {
      //eleBody.item(0).classList.remove("modal-open");
      var modalBackdrop = document.getElementsByClassName('modal-backdrop');
      if (modalBackdrop && modalBackdrop.length > 0) {
          modalBackdrop.item(0).remove();
        
      }
    }
  }
}
