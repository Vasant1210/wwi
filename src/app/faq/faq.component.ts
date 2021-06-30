import { Component, OnInit, EventEmitter, Output, ViewChild, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { FaqService } from '../_services/faq.service';
import { Faq } from '../_models/faq.model';
import { Observable, Subject, Subscription } from 'rxjs';
import { Webcast, User } from '../_models';
import { WebcastService, AuthenticationService } from '../_services';
import { map, tap } from 'rxjs/operators';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { StatsService } from '../_services/stats.service';
import { Stats } from '../_models/user-stats.model';
import { GoogleAnalyticsService, NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';



@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() onClose = new EventEmitter<any>();
  faqs: Observable<Faq[]>;
  webcast: Webcast;
  currentUser: User;
  showModal: boolean = false;
  

  constructor(private faqService: FaqService, private webcastService: WebcastService, private authService: AuthenticationService, private ngZone: NgZone, private statsService: StatsService,private $gaService: GoogleAnalyticsService) {
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
      this.$gaService.pageView(`/${this.webcast.webcast_id}/faq`, `/${this.webcast.webcast_id}/faq`, undefined, {
          user_id: this.currentUser.id            
        })       
      }else{
      this.$gaService.pageView(`/${this.webcast.webcast_id}/faq`, `/${this.webcast.webcast_id}/faq`)        
      }
    this.faqs = this.faqService.loadFaq(this.webcast.webcast_id);      
    this.statsService.trackActivity(this.webcast.webcast_id,'view_faq' );  
  }
  ngAfterViewInit() {
    
  }
  ngOnDestroy() {
    
  }
  closeModal() {
    this.onClose.emit();
  }
}
