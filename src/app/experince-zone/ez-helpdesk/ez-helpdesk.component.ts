import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/_models';
import { AuthenticationService } from 'src/app/_services';
import { HelpdeskService } from 'src/app/_services/helpdesk.service';

@Component({
  selector: 'app-ez-helpdesk',
  templateUrl: './ez-helpdesk.component.html',
  styleUrls: ['./ez-helpdesk.component.css']
})
export class EzHelpdeskComponent implements OnInit {

  currentUser: User;
  show: boolean = true;
  @Input() helpdesk_key: string = '';
  @Output() onToggleClick = new EventEmitter<boolean>();
  constructor(private helpdeskService: HelpdeskService, private authService: AuthenticationService) {
    this.authService.currentUser.subscribe(x => {
     // this.helpdeskService.load("/602f7e89918aa261274072a4/1eusocij1");
     // this.helpdeskService.UpdateTawkUser(x);
    });
  }

  ngOnInit(): void {
    this.show = true;
    //this.helpdeskService.SetChatVisibility(false);
  }
  getStatusClass() {
    return this.show === true ? 'show' : 'hide';
  }

  openHelpdesk() {
    //this.show = !this.show;
    //this.helpdeskService.SetChatVisibility(true);
    //this.helpdeskService.ExpandChatWindow(true);
  }
  ngOnDestroy() {
    this.helpdeskService.SetChatVisibility(false);
    this.helpdeskService.unloadScript();
  }

}
