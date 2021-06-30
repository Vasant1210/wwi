import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { NetworkingCardComponent } from './networking-card/networking-card.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as Hammer from 'hammerjs';
import { HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG}  from '@angular/platform-browser';
import { NgxSpinner } from 'ngx-spinner';

@NgModule({
  declarations: [NetworkingCardComponent],
  imports: [
    CommonModule,    
    RouterModule,
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    HammerModule,
    NgxSpinner
  ],
  exports: []
  
})
export class NetloungeModule { }
