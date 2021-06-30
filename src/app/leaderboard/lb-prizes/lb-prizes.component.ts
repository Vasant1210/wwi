import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'app-lb-prizes',
  templateUrl: './lb-prizes.component.html',
  styleUrls: ['./lb-prizes.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LbPrizesComponent implements OnInit {
  @Input() prizes:string; 
  constructor() { }

  ngOnInit(): void {

    console.log(this.prizes);
  }

}
