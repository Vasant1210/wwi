import { Component, OnInit } from '@angular/core';
import { WebcastService } from '../../_services';
import { Webcast } from '../../_models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  webcast: Webcast;
  constructor(private webcastService: WebcastService) {
    this.webcastService.webcast.subscribe(x => {
      if (x) {
        this.webcast = x;
      }
    });
  }

  ngOnInit(): void {
    
  }

}
