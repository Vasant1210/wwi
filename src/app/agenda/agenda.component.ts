import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AgendaService } from '../_services/agenda.service';
import { WebcastService, AuthenticationService } from '../_services';
import { Webcast, User } from '../_models';
import { Agenda } from '../_models/agenda.model';
import { Observable } from 'rxjs';
import { StatsService } from '../_services/stats.service';
import { Stats } from '../_models/user-stats.model';
import { GoogleAnalyticsService, NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {
  @Output() onClose = new EventEmitter<any>();
  agendas: Agenda[];
  webcast: Webcast;
  currentUser: User;
  constructor(private agendaService: AgendaService, private webcastService: WebcastService, private authService: AuthenticationService, private statsService: StatsService, private $gaService: GoogleAnalyticsService) {
    this.webcastService.webcast.subscribe(x => {
      this.webcast = x
    });
    this.authService.currentUser.subscribe(x => {
      this.currentUser = x
    });
  }

  ngOnInit(): void {
    if(this.currentUser)
    {
      this.$gaService.pageView(`/${this.webcast.webcast_id}/agenda`, `/${this.webcast.webcast_id}/agenda`, undefined, {
        user_id: this.currentUser.id            
      })       
    }else{
      this.$gaService.pageView(`/${this.webcast.webcast_id}/agenda`, `/${this.webcast.webcast_id}/agenda`)        
    }
    this.agendaService.loadAgenda(this.webcast.webcast_id).subscribe(x => { this.agendas = x; console.log(x);});
   //this.agendas = this.agendaService.loadAgenda(this.webcast.webcast_id);     
    this.statsService.trackActivity(this.webcast.webcast_id,'view_agenda' );  
  }
  closeModal() {
    this.onClose.emit();
  }
}
