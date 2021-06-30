import { Component,Input, OnInit,SimpleChange,Output,EventEmitter} from '@angular/core';
import { User, Webcast } from '../../_models';
import { Stall } from '../../_models/room.model';
import { AuthenticationService, WebcastService } from 'src/app/_services';
import { ViewerBussinessCard } from '../../_models/viewer-bussiness-card';
import { BusinessCardService } from '../../_services/business-card.service';
import { StatsService } from '../../_services/stats.service';
import { Stats } from '../../_models/user-stats.model';


@Component({
  selector: 'app-ez-card-exchange',
  templateUrl: './ez-card-exchange.component.html',
  styleUrls: ['./ez-card-exchange.component.css']
})
export class EzCardExchangeComponent implements OnInit {
  @Input() stall: Stall;
  @Output() onClose = new EventEmitter<any>();
  webcast: Webcast;
  user:User;
  representative:any;
  loading = false;
  submitted = false;  
  error = "";
  success = "";
  profile: any;
  profilePic = "";
  representativeprofilePic = "";
  constructor(private webcastService: WebcastService, private bCardService: BusinessCardService, private authenticationService: AuthenticationService, private statsService: StatsService) {
    this.webcastService.webcast.subscribe(x=>{
      if(x){
        this.webcast = x;
      }
    });
    this.authenticationService.currentUser.subscribe(x=>{
      this.user = x;
      if (x && x.profile)
      {
        this.profile =  this.user.profile;
      }
    })
   }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChange) {  
    if(this.stall) { 
     let representatives: any[]=this.stall.representatives;  
     this.representative=representatives[0];
      this.bCardService.addCard(this.webcast.webcast_id,this.representative.id,this.stall.room_type,JSON.stringify(this.representative)).subscribe(data => {
      if (data.error) {
        this.showError(data.error.message);
        console.log('bcarderror');
      } else {
        console.log('bcardsuccess');        
        this.resetLoading("true");
      }
    },
      error => {
        this.showError(error);
      });
      
      this.statsService.trackActivity(this.webcast.webcast_id,'exchange_business_cards');  

    }//if(this.stall)
  } //ngOnChange
   
  
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

  closePopup()
  {
    this.onClose.emit();
  }
  renderDefaultProfilePic(url,name) {
    if (url && url != "") {
      return url;
    } else {
      let canvas: HTMLCanvasElement = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      let ctx: any = canvas.getContext("2d");
      ctx.fillStyle = "#004c3f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "60px Config";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      if (name) {
        ctx.fillText(name.substr(0, 1), 50, 70);
      }
      else {
        ctx.fillText("T", 50, 70);
      }
      //ctx.fillText(currentUser.fullName.substr(0,1), 10, 50);
      return canvas.toDataURL("image/png");
    }
  }
}
