import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { XchatComponent } from './xchat.component';
import { XchatFriendsListComponent } from './xchat-friends-list/xchat-friends-list.component';
import { XchatWindowComponent } from './xchat-window/xchat-window.component';
import { SanitizeHtmlPipe } from '../sanitizing';
import { PerfectScrollbarModule, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';



@NgModule({
  imports: [CommonModule, FormsModule, HttpClientModule, PerfectScrollbarModule],
  declarations: [
    XchatComponent,
    XchatFriendsListComponent,
    XchatWindowComponent
  ],
  exports: [XchatComponent]
})
export class XchatModule { }
