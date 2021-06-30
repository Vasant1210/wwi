import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EzDetailComponent } from './ez-detail/ez-detail.component';
import { EzHelpdeskComponent } from './ez-helpdesk/ez-helpdesk.component';
import { EzResourceComponent } from './ez-resource/ez-resource.component';
import { ExperinceZoneComponent } from './experince-zone.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { EzCardExchangeComponent } from './ez-card-exchange/ez-card-exchange.component';
import { EzProductsComponent } from './ez-products/ez-products.component';
import { NgxImageGalleryModule } from 'ngx-image-gallery';
import { SanitizeHtmlPipe } from './sanitizing';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as Hammer from 'hammerjs';
import { HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [ EzDetailComponent,  EzHelpdeskComponent, EzResourceComponent, ExperinceZoneComponent, EzCardExchangeComponent, EzProductsComponent,SanitizeHtmlPipe],
  imports: [
    CommonModule,    
    SlickCarouselModule,
    NgxImageGalleryModule,
    RouterModule,
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    HammerModule,
    NgxSpinnerModule
  ],
  exports: [ExperinceZoneComponent]
  
})
export class ExperinceZoneModule { }
