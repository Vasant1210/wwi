import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService, CformService } from '../../app/_services';
import { Cform } from '../../app/_models';
import { FormsModule } from '@angular/forms'; 


@Component({
  templateUrl: 'notfound.component.html',
  styleUrls: ['notfound.component.css']
})

export class NotfoundComponent implements OnInit {
    submitted = false;
    loading = false;
    webcast_url ="";
    error:string ="";
    
    constructor(private router: Router,
       private cformService: CformService,
       private authenticationService: AuthenticationService, 
    ){
            this.authenticationService.logout();
            this.cformService.clearForm();
     
    }        
    
    ngOnInit(){
        
    }
    
    findWebCast() {
        
        this.submitted = true;
        if(this.webcast_url.trim()=="")
        {
           this.error = "Webcast Url is required";
           return false;
        }
        this.router.navigate([this.webcast_url]);
    }
    
}
