import { Component, OnInit, ElementRef, HostListener, Input } from '@angular/core';
import { HelpdeskService } from '../_services/helpdesk.service';
import { AuthenticationService } from '../_services';
import { environment } from '../../environments/environment';
import { User } from '../_models';
import {$,jQuery} from 'jquery';

@Component({
  selector: 'app-helpdesk',
  templateUrl: './helpdesk.component.html',
  styleUrls: ['./helpdesk.component.css']
})
export class HelpdeskComponent implements OnInit {

  currentUser: User;
  constructor(private eRef: ElementRef,private helpdeskService: HelpdeskService, private authService: AuthenticationService) {

    this.authService.currentUser.subscribe(x => {
      this.helpdeskService.load(`${environment.helpdeskkey}`);
      this.helpdeskService.UpdateTawkUser(x);
    });
  }

  ngOnInit(): void {
    this.helpdeskService.SetChatVisibility(false);
  }

  openHelpdesk() {
    this.helpdeskService.SetChatVisibility(true);
    this.helpdeskService.ExpandChatWindow(true);
  }
  ngOnDestroy() {
    this.helpdeskService.SetChatVisibility(false);
  }
  
  
    public text: String;

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(this.eRef.nativeElement.contains(event.target)) {
      this.helpdeskService.SetChatVisibility(false);
    } else {
      this.helpdeskService.SetChatVisibility(false);
    }
  }

 
  
  
  
}
