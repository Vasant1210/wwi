import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgxImageGalleryComponent, GALLERY_IMAGE, GALLERY_CONF } from "ngx-image-gallery";
import { WebcastService } from '../../_services';
import { Webcast } from '../../_models';
import { StatsService } from '../../_services/stats.service';
import { Stats } from '../../_models/user-stats.model';

import { Emedia } from '../../_models/emedia';

@Component({
  selector: 'app-shared-gallery',
  templateUrl: './app-gallery.component.html',
  styleUrls: ['./app-gallery.component.css']
})
export class AppGalleryComponent implements OnInit {
  @Input() images: Emedia[];
  @Input() videos: Emedia[];
  @Input() canDownload: boolean = false;
  @Input() canDelete: boolean = false;
  @Input() canAdd: boolean = false;
  @Input() showTitle: boolean = true;
  webcast: Webcast;

  @Output() onDelete = new EventEmitter<Emedia>();
  @Output() onAdd = new EventEmitter<Emedia>();
  @Output() onDonwload = new EventEmitter<Emedia>();

  @Output() onFullPageToggle = new EventEmitter<boolean>();

  @ViewChild(NgxImageGalleryComponent, { static: false }) ngxImageGallery: NgxImageGalleryComponent;
  
  conf: GALLERY_CONF = {
    imageOffset: '0px',
    showDeleteControl: false,
    showImageTitle: false,
    showThumbnails: false,
  };

  currently_playing_video = "";
  sliderImages: GALLERY_IMAGE[];

  hasImages = false;
  hasVideos = false;
  hasAction = false;
  
  constructor(private webcastService: WebcastService, private statsService: StatsService) {
    this.showTitle = true;
  }

  ngOnInit(): void {
    this.webcastService.webcast.subscribe(x => {
      if (x) {
        this.webcast = x;       
      }
    });

    console.log(this.images);
    this.hasImages = this.images && this.images.length > 0;
    this.hasVideos = this.videos && this.videos.length > 0;
    this.prepareSliderImages();
    this.hasAction = this.canAdd || this.canDelete || this.canDownload
  }
  prepareSliderImages() {
    let _images: any[] = [];
    if (this.hasImages) {
      for (let i = 0; i < this.images.length; i++) {
        let obj: GALLERY_IMAGE = {
          url: this.images[i].file_name,
          thumbnailUrl: this.images[i].thumbnail,
        }
        _images.push(obj);
      }
    }
    this.sliderImages = _images; 
  }
  galleryOpened(index: number = 0) {
  }

  openGallery(index: number = 0) {
    this.onFullPageToggle.emit(true);
    this.ngxImageGallery.images = this.sliderImages;
    this.ngxImageGallery.open(index);
  }

  closeGallery() {
    this.ngxImageGallery.close();
  }

  galleryClosed() {
    this.onFullPageToggle.emit(false);
    this.ngxImageGallery.images = [];
  }

  newImage(index: number = 0) {
    this.ngxImageGallery.setActiveImage(index);
  }

  nextImage(index: number = 0) {
    this.ngxImageGallery.next();
  }

  prevImage(index: number = 0) {
    this.ngxImageGallery.prev();
  }

  setCurrentVideo($video) {
    this.onFullPageToggle.emit(true);
    this.currently_playing_video = $video;
  }
  closeVideoPopup() {
    this.onFullPageToggle.emit(false);
    this.currently_playing_video = "";
  }
  delete($event) {
    this.onDelete.emit($event);
  }
  add($event) {
    this.onAdd.emit($event);
  }
  onDownload()
  {
    this.statsService.trackActivity(this.webcast.webcast_id,'download_item_briefcase');
    console.log("Called dowmload");
  }
}
