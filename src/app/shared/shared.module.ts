import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { NgxImageGalleryModule } from 'ngx-image-gallery';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SanitizeHtmlPipe } from './sanitizing';
import { AppGalleryComponent } from './app-gallery/app-gallery.component';
import { SharedViewerCardComponent } from './shared-viewer-card/shared-viewer-card.component';




@NgModule({
  declarations: [HeaderComponent, AppGalleryComponent,SanitizeHtmlPipe, SharedViewerCardComponent],
  imports: [
    CommonModule,
    NgxImageGalleryModule,
    PerfectScrollbarModule
    
  ],
  exports: [HeaderComponent, AppGalleryComponent, SanitizeHtmlPipe, SharedViewerCardComponent]
})
export class SharedModule { }
