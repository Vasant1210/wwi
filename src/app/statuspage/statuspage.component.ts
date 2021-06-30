import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WebcastService,AuthenticationService,CformService } from '../../app/_services';
import { Webcast,User,Cform, AppState } from '../../app/_models';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AppStateService } from '../_services/app-state.service';
import { CommonModule } from '@angular/common';

@Component({ templateUrl: 'statuspage.component.html' })
export class StatuspageComponent implements OnInit {
  webcast_id = "";
  webcast: Observable<Webcast>;
    currentUser: User;
    cform: Cform;
    status="";
    page_mode = "";
    content_style={};
    theme_color = "#3490dc";//{"color":"#3490dc"};
    theme_background = {"background":"#3490dc","border-color":"#3490dc"};
    banner_image = "";
    loading = false;
    register_url= "";
    webcastStatusUpdateStream:any;
    appState: AppState;

    constructor(private webcastService: WebcastService,
            private route: ActivatedRoute,
            private router: Router,
            private authenticationService: AuthenticationService,
            private cformService: CformService,
      private zone: NgZone,
      private appStateService: AppStateService
    )
    {
        this.cformService.cform.subscribe(x => this.cform = x);
        this.webcast_id = this.route.snapshot.params.webcast_id;
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
      this.register_url = `${environment.imageUrl}${this.webcast_id}`;
      
    }        
    
    ngOnInit(){

        if(!this.webcast_id){
            this.logout();
            this.router.navigate(['notfound'])
        }
        if(!this.cform)
        {
            this.getWebcastTemplate();
        }else if(this.cform && this.cform.webcast_id != this.webcast_id)
        {
            this.getWebcastTemplate();
        }
        else{
            this.applyStyle(this.cform);
        }
        let params = this.router.url.split('/');
        if(params.length >0){
            this.status = params[2];
            this.renderView();
        }else{
            this.renderView();
        }
        
        
        
    }
    renderView()
    {
        switch(this.status)
        {
            case "live-soon":
            case "publish":
                this.liveSoon();
                // js function to redirect after
                break;
            case "end":
                if(this.currentUser) {
                  this.thankyou();      
                } else{
                    this.page_mode = "end";
                    this.completed();
                }  
            break;
            default:
                  this.router.navigate(['notfound'])
    
        }
    }
    getWebcast()
    {
      if (this.webcast_id != "") {
        this.webcast=  this.webcastService.getWebcast(this.webcast_id);
        }
    }
    getWebcastTemplate()
    {
        this.loading = true;
        this.logout();
        this.cformService.getWebcastTemplate(this.webcast_id).subscribe(
          result => {
              this.applyStyle(result);
              this.loading = false;
          });
    }
    applyStyle(result)
    {
        if(result.theme.content.bg){
        let bg = result.theme.content.bg;
        if(bg.indexOf(".") > 0){
            this.content_style  = {"background-position":"center",
                    "background-size":"cover",
                    "background-image": "url('"+`${environment.imageUrl}/${bg}`+"')"
                   };
        }else{
            this.content_style  = {"background-color" : bg};
        }}
        if(result.theme.theme){
            this.theme_color =  result.theme.theme.color;// {"color":result.theme.theme.color};
            this.theme_background = {"background":result.theme.theme.color,"border-color":result.theme.theme.color};
        }
        if(result.theme.content && result.theme.content.bannerimage){
            let bg1 = result.theme.content.bannerimage
            this.banner_image =  `${environment.imageUrl}/${bg1}`;
        }
    }
    liveSoon()
    {
        //window.location.href="https://exiweb.online/" + this.webcast_id + "/register";
        this.page_mode = "livesoon";
        this.getWebcast();
        this.statusStream();
        //webcast status stream 
    }
    
    thankyou()
    {
        if(!this.webcast)
        {
            this.getWebcast();
        }
      this.page_mode = "thankyou";
      this.webcast.subscribe(x => {
        if (x.widgets) {
          let widets = (x.widgets);
          if (!Array.isArray(x.widgets)) {
            widets = JSON.parse(x.widgets);
          }
          let enbabled = widets.filter(x => x.includes('feedback'));
          if (enbabled.length > 0) {
            this.appState = new AppState();
            this.appState.showFeedback = true;
            this.appStateService.updateAppSettings(this.appState);
          } else {
            //or logout user  after 5 seconds 
            this.initInterval()
          }
        }
      });
  }

    completed()
    {
        this.page_mode = "completed";
    }    
    logout() {
        this.page_mode='completed'
        if(this.currentUser)
        {
            this.webcast_id =  this.currentUser.webcast_id;
            this.authenticationService.init_logout(this.currentUser).subscribe(
            result=>{
                this.authenticationService.logout();
                //this.cformService.clearForm();
                //this.router.navigate([`${this.webcast_id}`]);
            }
            );
        }else
        {
            this.authenticationService.logout();
            //this.cformService.clearForm();
            //this.router.navigate([`${this.webcast_id}`]);
        }
    }
    initInterval() {
      setInterval(() => {
          this.logout();
        }, 5000);
      }

    statusStream(){
      if (this.webcast_id) {
        if (typeof (EventSource) !== "undefined") {
          let es = new EventSource(`${environment.apiUrl}/${this.webcast_id}/status_stream`);
          es.addEventListener('message', event => {
            let response = JSON.parse(event.data);
            if (response) {
              this.checkStatus(response);
            }
          });
          es.addEventListener('error', event => { });
        } else {
          // Sorry! No server-sent events support..
          this.initFallback();
        }
      }
  }
  initFallback() {
    this.zone.runOutsideAngular(() => {
      setInterval(() => { this.getAjaxStatusUpdateFeed(); }, 5000);
    });
  }
  getAjaxStatusUpdateFeed() {
    this.webcastService.getWebcastStatusFeed(this.webcast_id).subscribe(
      data => {
        this.checkStatus(data.data);
      }
    );
  }
    checkStatus(status){
        switch(status)
        {
            case "archive":
            case "end":
            case "publish":
                this.webcastStatusUpdateStream.close();
                break;
          case "live":
          case "ready":
                this.webcastStatusUpdateStream.close();
                this.router.navigate([`${this.webcast_id}`]);
                break;
        }
    }  
}
