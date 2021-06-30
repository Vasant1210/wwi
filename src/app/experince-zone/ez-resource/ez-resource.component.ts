import { Component, EventEmitter, Input, OnInit,Output,SimpleChange, ViewChild } from '@angular/core';
//import { NgxImageGalleryComponent, GALLERY_IMAGE, GALLERY_VIDEO, GALLERY_CONF } from "ngx-image-gallery";
import { NgxImageGalleryComponent, GALLERY_IMAGE, GALLERY_CONF } from "ngx-image-gallery";
import { Emedia } from 'src/app/_models/emedia';
import { User, Webcast } from '../../_models';
import { GalleryService } from '../../_services/gallery.service';
import { viewerMedia } from '../../_models/viewer-media';
import { WebcastService } from 'src/app/_services';

@Component({
  selector: 'app-ez-resource',
  templateUrl: './ez-resource.component.html',
  styleUrls: ['./ez-resource.component.css']
})
export class EzResourceComponent implements OnInit {
  @ViewChild(NgxImageGalleryComponent,{ static: false }) ngxImageGallery: NgxImageGalleryComponent;
  @ViewChild('modalCloseButton') modalCloseButton;
  @Input() gallery: Emedia[];
  @Output() onClose = new EventEmitter<any>();
  @Output() onDetailViewToggle = new EventEmitter<boolean>();
  
  conf: GALLERY_CONF = {
    imageOffset: '0px',
    showDeleteControl: false,
     showImageTitle: false,
     showThumbnails: false,
  };
  currently_playing_video = "";
  // gallery images
  images: GALLERY_IMAGE[];
  
 
  document:Emedia[]=[];
  media:Emedia[]=[];
  vmedia:Emedia[]=[];

  media_id:number;
  media_type:string;
  loading = false;
  submitted = false;
  currentUser: User;
  webcast: Webcast;
  error = "";
  success = "";
  
  activeTab= 'document';
  constructor(private webcastService: WebcastService,private galleryService: GalleryService) {
    this.webcastService.webcast.subscribe(x=>{
      if(x){
        this.webcast = x;
      }
    });

   }

  ngOnInit(): void {    
    this.success = "";
    this.error = "";
  }
  
  ngOnChanges(changes: SimpleChange) {  
    this.populateImages();
    this.populateDocuments();
    this.populateVideos();
    this.activeTab =  this.document.length>0?'document':'media';
  }


  populateDocuments()
  {
    this.document = this.gallery.filter(y => y.type == 'document');
  }
  
 
  populateImages() {

    this.media = this.gallery.filter(y => y.type == 'image');

  }
  populateVideos() {
   this.vmedia = this.gallery.filter(y => y.type == 'video'); 
  }
  
  add_to_briefcase(vmedia:Emedia)
  {
    this.galleryService.submitViewerMedia(this.webcast.webcast_id,vmedia.id,vmedia.type).subscribe(data => {
      if (data.error) {
        this.showError(data.error.message);
      } else {
        this.resetLoading("true");
      }
    },
      error => {
        this.showError(error);
      });
  }
  showError(message) {
    this.error = message;
    this.loading = false;
    this.submitted = false;
  }
  setLoading() {
    this.error = "";
    this.loading = true;
    this.submitted = true;
  }
  unsetLoading() {
    this.loading = false;
  }
  resetLoading(message) {
    this.success = message;
    this.error = "";
    this.loading = false;
    this.submitted = false; 
    setTimeout(() => {
      this.success = ""; // Here, value is updated
    }, 5000);   
  }
 
  switchTab(tab)
  {
    this.activeTab = tab;
  }

  closePopup()
  {
    this.onClose.emit();
  }
  onGalleryFullPage($event) {
    this.onDetailViewToggle.emit($event);
  }
  openDocumnet(filename: string) {
    //console.log(filename);
    window.open(filename, '_blank');
  }

}
